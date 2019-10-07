import _ from 'lodash';

let eventFrom = (name, date) => {
  return { name, date };
};

let makeCalendarShell = (server = makeServer(makeSqlRepository({}))) => { 
  return { 
    events: { },
    errors: { },
    server
  };
};

let addEvent = async (calendarShell, name, date) => {
  try {
    await calendarShell.server.addEvent(name, date);
    let events = calendarShell.events[date] || [];
    calendarShell.events[date] = [...events, eventFrom(name, date)];
  } catch(err) {
    calendarShell.errors["addEventError"] = err;
  }
};

let viewCalendar = async (calendarShell) => {
  let events = await calendarShell.server.viewEvents();
  calendarShell.events = _.groupBy(events, 'date');
};

let makeSqlRepository = (datastore) => {
  return {
    datastore,
    setup() {
      datastore.setup('CREATE TABLE events (id SERIAL PRIMARY KEY, name VARCHAR(255), date TIMESTAMP)');
    },
    addEvent(name, date) {
      return datastore.execute(`INSERT INTO events (name, date) VALUES ('${name}', '${date}')`);
    },
    viewEvents() {
      return datastore.execute("SELECT * FROM events");
    }
  };
};

let makeServer = (repository) => {
  return {
    repository,
    addEvent(name, date) {
      return repository.addEvent(name, date);
    },
    viewEvents() {
      return repository.viewEvents();
    }
  };
};

let commands = { addEvent, viewCalendar };

export { makeCalendarShell, makeServer, makeSqlRepository };

export default commands;
