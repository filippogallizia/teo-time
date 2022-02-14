import { expect } from 'chai';
import { DateTime } from 'luxon';

import { createAvalAlgoritm } from '../createAvalAlgoritm';

describe('AvalAlgoritm', () => {
  it('should return array', function () {
    const workTimeRange = { start: '12:40', end: '21:00' };
    const breakTimeRange = { start: '10:00', end: '13:20' };
    const eventDuration = { hours: 1, minutes: 0 };
    const breakTimeBtwEvents = { hours: 0, minutes: 40 };
    expect(
      createAvalAlgoritm(
        workTimeRange,
        breakTimeRange,
        eventDuration,
        breakTimeBtwEvents
      )
    ).to.be.a('array');
  });

  it('break > workTime returns []', function () {
    const workTimeRange = { start: '12:40', end: '21:00' };
    const breakTimeRange = { start: '10:00', end: '22:20' };
    const eventDuration = { hours: 1, minutes: 0 };
    const breakTimeBtwEvents = { hours: 0, minutes: 40 };

    expect(
      createAvalAlgoritm(
        workTimeRange,
        breakTimeRange,
        eventDuration,
        breakTimeBtwEvents
      )
    ).to.length(0);
  });

  it('break === workTime returns []', function () {
    const workTimeRange = { start: '12:40', end: '21:00' };
    const breakTimeRange = { start: '12:40', end: '21:00' };
    const eventDuration = { hours: 1, minutes: 0 };
    const breakTimeBtwEvents = { hours: 0, minutes: 40 };

    expect(
      createAvalAlgoritm(
        workTimeRange,
        breakTimeRange,
        eventDuration,
        breakTimeBtwEvents
      )
    ).to.length(0);
  });

  it('breakStart < dayEnd < breakEnd return  last item <= breakStart', function () {
    const workTimeRange = { start: '07:40', end: '17:00' };
    const breakTimeRange = { start: '16:00', end: '22:20' };
    const eventDuration = { hours: 1, minutes: 0 };
    const breakTimeBtwEvents = { hours: 0, minutes: 40 };

    const breakStart = DateTime.fromISO(breakTimeRange.start).toJSDate();

    const prova = createAvalAlgoritm(
      workTimeRange,
      breakTimeRange,
      eventDuration,
      breakTimeBtwEvents
    );

    //TODO -> find a way to say below or equal

    expect(
      DateTime.fromISO(prova[prova.length - 1].end).toJSDate()
    ).to.be.below(breakStart);
  });

  it('dayStart > breakEnd return firstItem === dayStart', function () {
    const workTimeRange = { start: '16:40', end: '22:00' };
    const breakTimeRange = { start: '16:00', end: '16:20' };
    const eventDuration = { hours: 1, minutes: 0 };
    const breakTimeBtwEvents = { hours: 0, minutes: 40 };

    const dayStart = DateTime.fromISO(workTimeRange.start).toString();

    const result = createAvalAlgoritm(
      workTimeRange,
      breakTimeRange,
      eventDuration,
      breakTimeBtwEvents
    );

    expect(DateTime.fromISO(result[0].start).toString()).to.be.equal(dayStart);
  });

  it('dayStart + eventDuration < dayEnd return []', function () {
    const workTimeRange = { start: '09:00', end: '10:00' };
    const breakTimeRange = { start: '11:00', end: '16:20' };
    const eventDuration = { hours: 1, minutes: 0 };
    const breakTimeBtwEvents = { hours: 0, minutes: 40 };

    expect(
      createAvalAlgoritm(
        workTimeRange,
        breakTimeRange,
        eventDuration,
        breakTimeBtwEvents
      )
    ).to.length(0);
  });
});
