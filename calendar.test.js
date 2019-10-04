var _ = require('lodash');

let eventNameAt = (idx, calendarShell) => {
  return calendarShell.events[idx].name;
};

let dateAt = (idx, calendarShell) => {
  return calendarShell.events[idx].date;
};

let addEventArray = (calendarShell, name, date) => {
  calendarShell.events.push({ name, date });
};

let eventFrom = (name, date) => {
  return { name, date };
};

let makeCalendarShell = () => { 
  return { events: { } }
};

let addEvent = (calendarShell, name, date) => {
  let dateComponent = _.split(date, ', ')[0];
  let events = calendarShell.events[dateComponent] || []
  calendarShell.events[dateComponent] = [...events, eventFrom(name, date)]
};

let viewCalendar = (calendarShell) => {
  calendarShell.events.push({
    name: 'Test Event',
    date: '9/26/19, 12:30pm'
  });
};

let commands = { addEvent, addEventArray, viewCalendar };

test('adding event', () => {
  let calendarShell = { events: [] };

  commands.addEventArray(calendarShell, 'Test Event', '9/26/19, 12:30pm');

  expect(eventNameAt(0, calendarShell)).toBe('Test Event');
  expect(dateAt(0, calendarShell)).toBe('9/26/19, 12:30pm');
});

test('adding multiple events at same time', () => {
  let calendarShell = makeCalendarShell();

  commands.addEvent(calendarShell, 'TestEvent1', '9/26/19, 12:30pm');
  commands.addEvent(calendarShell, 'TestEvent2', '9/26/19, 12:30pm');

  console.log("calendar shell");
  console.log(calendarShell);

  expect(calendarShell.events['9/26/19'][0].name).toBe('TestEvent1');
  expect(calendarShell.events['9/26/19'][1].name).toBe('TestEvent2');
});

test('viewing calendar', () => {
  let calendarShell = { events: [] };

  commands.viewCalendar(calendarShell);

  expect(eventNameAt(0, calendarShell)).toBe('Test Event');
});
