import { TimeRangeType } from '../../../types/Types';

const { DateTime } = require('luxon');

// TYPES

type K = {
  hours: number;
  minutes: number;
};

type TimeRangeTypeJson = {
  start: typeof DateTime;
  end: typeof DateTime;
};

type GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: {
    day: string;
    availability: TimeRangeTypeJson[];
  }[];
};

const compareTwoDatesWithK = (
  workTimeRange: TimeRangeType,
  breakTimeRange: TimeRangeType,
  eventDuration: K,
  breakTimeBtwEvents: { hours: number; minutes: number }
) => {
  const dayStart = DateTime.fromISO(workTimeRange.start);
  const dayEnd = DateTime.fromISO(workTimeRange.end);

  const breakStart = DateTime.fromISO(breakTimeRange.start);
  const breakEnd = DateTime.fromISO(breakTimeRange.end);

  const availabilitiesBucket: any = [];

  const tmpBucket: any = [];

  // if thera are not slot in bucket && dayStart piu' eventDuration are smaller then breakStart, then push in the bucket
  while (
    dayStart.plus(eventDuration) <= breakStart &&
    availabilitiesBucket.length === 0
  ) {
    availabilitiesBucket.push({
      start: dayStart.toUTC(),
      end: dayStart.plus(eventDuration),
    });
  }

  // if thera are not slot in bucket && dayStart piu' eventDuration is bigger then breakStart but breakEnd plus eventDuration is smaller the dayEnd, then push in the bucket

  while (
    dayStart.plus(eventDuration) > breakStart &&
    availabilitiesBucket.length === 0 &&
    breakEnd.plus(eventDuration) <= dayEnd
  ) {
    availabilitiesBucket.push({
      start: breakStart.toUTC(),
      end: breakStart.plus(eventDuration),
    });
  }

  // if fineUltimoTurno plus eventDuration is smaller then breakStart, then push in bucket

  while (
    availabilitiesBucket[availabilitiesBucket.length - 1].end
      .plus(eventDuration)
      .plus(breakTimeBtwEvents) <= breakStart
  ) {
    availabilitiesBucket.push({
      start:
        availabilitiesBucket[availabilitiesBucket.length - 1].end.plus(
          breakTimeBtwEvents
        ),
      end: availabilitiesBucket[availabilitiesBucket.length - 1].end
        .plus(eventDuration)
        .plus(breakTimeBtwEvents),
    });
  }

  // if breakEnd plus eventDuration is smaller then dayEnd, then push in bucket

  while (
    breakEnd.plus(eventDuration) <= dayEnd &&
    availabilitiesBucket[availabilitiesBucket.length - 1].end <= dayEnd &&
    availabilitiesBucket[availabilitiesBucket.length - 1].end
      .plus(eventDuration)
      .plus(breakTimeBtwEvents) <= dayEnd
  ) {
    if (tmpBucket.length === 0) {
      tmpBucket.push({
        start: breakEnd,
        end: breakEnd.plus(eventDuration),
      });
    } else {
      tmpBucket.push({
        start: tmpBucket[tmpBucket.length - 1].end.plus(breakTimeBtwEvents),
        end: tmpBucket[tmpBucket.length - 1].end
          .plus(eventDuration)
          .plus(breakTimeBtwEvents),
      });
    }
    availabilitiesBucket.push({
      start: tmpBucket[tmpBucket.length - 1].start,
      end: tmpBucket[tmpBucket.length - 1].end,
    });
  }
  return availabilitiesBucket.map((obj: { start: Date; end: Date }) => ({
    start: DateTime.fromISO(obj.start).toUTC().toISO(),
    end: DateTime.fromISO(obj.end).toUTC().toISO(),
  }));
};

const days = [
  {
    day: 'Monday',
    parameters: {
      workTimeRange: {
        start: '2021-10-04T07:30:00.000Z',
        end: '2021-10-04T21:15:00.000Z',
      },
      breakTimeRange: {
        start: '2021-10-04T12:00:00.000Z',
        end: '2021-10-04T13:30:00.000Z',
      },
      eventDuration: { hours: 1, minutes: 0 },
      breakTimeBtwEvents: { hours: 0, minutes: 30 },
    },
  },
  {
    day: 'Tuesday',
    parameters: {
      workTimeRange: {
        start: '2021-10-04T07:30:00.000Z',
        end: '2021-10-04T21:15:00.000Z',
      },
      breakTimeRange: {
        start: '2021-10-04T12:00:00.000Z',
        end: '2021-10-04T13:30:00.000Z',
      },
      eventDuration: { hours: 1, minutes: 0 },
      breakTimeBtwEvents: { hours: 0, minutes: 30 },
    },
  },
  {
    day: 'Wednesday',
    parameters: {
      workTimeRange: {
        start: '2021-10-04T07:30:00.000Z',
        end: '2021-10-04T21:15:00.000Z',
      },
      breakTimeRange: {
        start: '2021-10-04T12:00:00.000Z',
        end: '2021-10-04T13:30:00.000Z',
      },
      eventDuration: { hours: 1, minutes: 0 },
      breakTimeBtwEvents: { hours: 0, minutes: 45 },
    },
  },
];

const result = days.map((day: any) => {
  return {
    day: day.day,
    availability: compareTwoDatesWithK(
      day.parameters.workTimeRange,
      day.parameters.breakTimeRange,
      day.parameters.eventDuration,
      day.parameters.breakTimeBtwEvents
    ),
  };
});

module.exports = { generalAvaliabilityRules: result, compareTwoDatesWithK };
