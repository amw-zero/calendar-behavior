"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.makeServer = exports.makeSqlRepository = exports.makeCalendarShell = void 0;

let eventFrom = (name, date) => {
  return {
    name,
    date
  };
};

let makeCalendarShell = (server = makeServer(makeSqlRepository({}))) => {
  return {
    events: {},
    errors: {},
    server
  };
};

exports.makeCalendarShell = makeCalendarShell;

let addEvent = async (calendarShell, name, date) => {
  try {
    await calendarShell.server.addEvent(name, date);
    let events = calendarShell.events[date] || [];
    calendarShell.events[date] = [...events, eventFrom(name, date)];
  } catch (err) {
    calendarShell.errors["addEventError"] = err;
  }
};

let viewCalendar = calendarShell => {
  calendarShell.events.push({
    name: 'Test Event',
    date: '9/26/19, 12:30pm'
  });
};

let makeSqlRepository = datastore => {
  return {
    datastore,

    setup() {
      datastore.setup('CREATE TABLE events (id SERIAL PRIMARY KEY, name VARCHAR(255), date TIMESTAMP)');
    },

    addEvent(name, date) {
      return datastore.execute('INSERT INTO events (name, date) VALUES ($1, $2)', name, date);
    }

  };
};

exports.makeSqlRepository = makeSqlRepository;

let makeServer = repository => {
  return {
    repository,

    addEvent(name, date) {
      return repository.addEvent(name, date);
    }

  };
};

exports.makeServer = makeServer;
let commands = {
  addEvent,
  viewCalendar
};
var _default = commands;
exports.default = _default;
