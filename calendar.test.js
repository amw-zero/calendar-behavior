import { expect } from 'chai';
import commands, { makeCalendarShell } from './mod.mjs';

let eventNameAt = (idx, calendarShell) => {
  return calendarShell.events[idx].name;
};

let dateAt = (idx, calendarShell) => {
  return calendarShell.events[idx].date;
};

describe('adding event', () => {
  it('adds', () => {
    let calendarShell = makeCalendarShell();
    let date = '9/26/19, 12:30pm';

    commands.addEvent(calendarShell, 'Test Event', date);

    let event = calendarShell.events[date][0];
    expect(event.name).to.eq('Test Event');
    expect(event.date).to.eq('9/26/19, 12:30pm');
  });
});

describe('adding multiple events at same time', () => {
  it('adds both events to the same date', () => { 
    let calendarShell = makeCalendarShell();

    let date = '9/26/19, 12:30pm';
    commands.addEvent(calendarShell, 'TestEvent1', date);
    commands.addEvent(calendarShell, 'TestEvent2', date);

    expect(calendarShell.events[date][0].name).to.eq('TestEvent1');
    expect(calendarShell.events[date][1].name).to.eq('TestEvent2');
  });
});

describe('viewing calendar', () => {
  it('is viewed', () => {
    let calendarShell = { events: [] };

    commands.viewCalendar(calendarShell);

    expect(eventNameAt(0, calendarShell)).to.eq('Test Event');
  });
});
