var _ = require('lodash');

let eventNameAt = (idx, calendarShell) => {
  return calendarShell.events[idx].name;
};

let dateAt = (idx, calendarShell) => {
  return calendarShell.events[idx].date;
};

let eventFrom = (name, date) => {
  return { name, date };
};

let makeCalendarShell = () => { 
  return { events: { } }
};

let addEvent = (calendarShell, name, date) => {
  let events = calendarShell.events[date] || []
  calendarShell.events[date] = [...events, eventFrom(name, date)]
};

let viewCalendar = (calendarShell) => {
  calendarShell.events.push({
    name: 'Test Event',
    date: '9/26/19, 12:30pm'
  });
};

let commands = { addEvent, viewCalendar };

test('adding event', () => {
  let calendarShell = makeCalendarShell();
  let date = '9/26/19, 12:30pm';

  commands.addEvent(calendarShell, 'Test Event', date);

  let event = calendarShell.events[date][0];
  expect(event.name).toBe('Test Event');
  expect(event.date).toBe('9/26/19, 12:30pm');
});

test('adding multiple events at same time', () => {
  let calendarShell = makeCalendarShell();

  let date = '9/26/19, 12:30pm';
  commands.addEvent(calendarShell, 'TestEvent1', date);
  commands.addEvent(calendarShell, 'TestEvent2', date);

  console.log("calendar shell");
  console.log(calendarShell);

  expect(calendarShell.events[date][0].name).toBe('TestEvent1');
  expect(calendarShell.events[date][1].name).toBe('TestEvent2');
});

test('viewing calendar', () => {
  let calendarShell = { events: [] };

  commands.viewCalendar(calendarShell);

  expect(eventNameAt(0, calendarShell)).toBe('Test Event');
});
