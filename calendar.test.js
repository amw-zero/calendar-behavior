import { expect } from 'chai';
import commands, { makeCalendarShell, makeSqlRepository, makeServer } from './mod.mjs';
import alasql from 'alasql';

let memoryDatastore = {
  setup(query) {
    alasql(query);
  },
  execute(query) {
    return alasql.promise(query);
  }
};

function makeTestCalendarShell(repository) {
  return makeCalendarShell(makeServer(repository));
}

describe("calendar", () => {
  let memorySqlRepository;
  let errorSqlRepository

  beforeEach(() => {
    memorySqlRepository = makeSqlRepository(memoryDatastore);
    memorySqlRepository.setup();
    errorSqlRepository = {
      setup() {
        throw new Error("Fake error");
      },
      addEvent() {
        throw new Error("Fake error");
      }
    }
  });

  afterEach(() => {
    alasql("DROP TABLE events");
  })

  describe('adding event successfully', () => {
    it('adds the event', async () => {
      let calendarShell = makeTestCalendarShell(memorySqlRepository);
      let date = '9/26/19, 12:30pm';

      await commands.addEvent(calendarShell, 'Test Event', date);

      let event = calendarShell.events[date][0];
      expect(event.name).to.eq('Test Event');
      expect(event.date).to.eq('9/26/19, 12:30pm');
    });
  });

  describe('adding event with error', () => {
    it('does not add the event', async () => {
      let calendarShell = makeTestCalendarShell(errorSqlRepository);
      let date = '9/26/19, 12:30pm';

      await commands.addEvent(calendarShell, 'Test Event', date);

      expect(calendarShell.events).to.deep.eq({});
      expect(calendarShell.errors["addEventError"].message).to.eq("Fake error")
    });
  });

  describe('adding multiple events at same time', () => {
    it('adds both events to the same date', async () => { 
      let calendarShell = makeCalendarShell(memorySqlRepository);
      let date = '9/26/19, 12:30pm';

      await commands.addEvent(calendarShell, 'TestEvent1', date);
      await commands.addEvent(calendarShell, 'TestEvent2', date);

      expect(calendarShell.events[date][0].name).to.eq('TestEvent1');
      expect(calendarShell.events[date][1].name).to.eq('TestEvent2');
    });
  });

  describe('viewing calendar', () => {
    it('is viewed', async () => {
      let calendarShell = makeCalendarShell(memorySqlRepository);
      let date = '10/07/1992, 12:00pm';

      await commands.addEvent(calendarShell, 'Persisted Event', date);
      await commands.viewCalendar(calendarShell);

      expect(calendarShell.events[date][0].name).to.eq('Persisted Event');
    });
  });
});
