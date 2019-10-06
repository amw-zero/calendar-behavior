let eventFrom = (name, date) => {
  return { name, date };
};

let makeCalendarShell = () => { 
  return { events: { } };
};

let addEvent = async (calendarShell, name, date) => {
  let events = calendarShell.events[date] || [];
  calendarShell.events[date] = [...events, eventFrom(name, date)];
};

let viewCalendar = (calendarShell) => {
  calendarShell.events.push({
    name: 'Test Event',
    date: '9/26/19, 12:30pm'
  });
};

let commands = { addEvent, viewCalendar };

export { makeCalendarShell };

export default commands;