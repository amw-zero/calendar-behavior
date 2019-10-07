"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.makeSqlRepository = exports.makeServer = exports.makeCalendarShell = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

let viewEvents = async calendarShell => {
  let events = await calendarShell.server.viewEvents();
  calendarShell.events = _lodash.default.groupBy(events, 'date');
};

let makeSqlRepository = datastore => {
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

exports.makeSqlRepository = makeSqlRepository;

let makeServer = repository => {
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

exports.makeServer = makeServer;
let commands = {
  addEvent,
  viewEvents
};
var _default = commands;
exports.default = _default;
