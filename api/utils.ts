import { DateTime } from 'luxon';

import {
  BookingType,
  DayAvailabilityType,
  GeneralAvaliabilityRulesType,
  HrsAndMinsType,
  TimeRangeType,
} from './src/types/types';

const _ = require('lodash');

export const HOUR_MINUTE_FORMAT = (value: string): string => {
  return DateTime.fromISO(value).toFormat('HH:mm');
};

export const FROM_DATE_TO_HOUR = (date: string) => {
  return DateTime.fromISO(date).hour;
};

export const FROM_DATE_TO_MINUTES = (date: string) => {
  return DateTime.fromISO(date).minute;
};

export const TODAY_AT_MIDNIGHT = () => {
  return DateTime.fromJSDate(new Date()).set({
    hour: 0,
    minute: 0,
    millisecond: 0,
  });
};

export const FROM_DATE_TO_DAY = (date: string) => {
  return DateTime.fromISO(date).weekdayLong;
};

export const DATE_TO_CLIENT_FORMAT = (date: string) => {
  return DateTime.fromISO(date).toFormat('yyyy LLL dd t');
};

// loop throug general Aval, filter for day with timerange, return availabilities with uploaded date

export const filterDays_updateDate = (
  genAv: DayAvailabilityType,
  timerange: TimeRangeType[]
): {
  day: string;
  availability: TimeRangeType[];
}[] => {
  return _.intersectionWith(
    genAv,
    timerange,
    (a: DayAvailabilityType, b: TimeRangeType) => {
      return a.day == FROM_DATE_TO_DAY(b.start);
    }
  ).map((day: DayAvailabilityType) => {
    // update the date
    const parseAvailabilities = day.availability.map(
      (a: { start: string; end: string }) => {
        return {
          start: joinDayAndTime(timerange[0].start, a.start),
          end: joinDayAndTime(timerange[0].end, a.end),
        };
      }
    );
    return {
      ...day,
      date: timerange[0],
      availability: parseAvailabilities,
    };
  });
};

// use this function to create availabilities after comparing them with existing bookings

export const createAvalFromBks = (
  availabilities: TimeRangeType[],
  bookings: BookingType[]
) => {
  return _.differenceWith(
    // scenario one day
    availabilities,
    bookings,
    (aval: any, bks: any) => {
      return (
        (bks.start <= aval.start && bks.end >= aval.end) ||
        (bks.start >= aval.start && bks.start < aval.end) ||
        (bks.end >= aval.start && bks.end < aval.end)
      );
    }
  );
};

export const joinDayAndTime = (date_day: string, date_time: string) => {
  console.log(date_day, 'date day');
  console.log(date_time, 'date time');
  return DateTime.fromISO(date_day)
    .set({
      hour: FROM_DATE_TO_HOUR(date_time),
      minute: FROM_DATE_TO_MINUTES(date_time),
      second: 0,
      millisecond: 0,
    })
    .toISO();
};

// this function create aval slot given the following inputs

export const createDynamicAval = (
  workTimeRange: TimeRangeType,
  breakTimeRange: TimeRangeType,
  eventDuration: HrsAndMinsType,
  breakTimeBtwEvents: HrsAndMinsType
) => {
  const dayStart = DateTime.fromISO(workTimeRange.start);
  const dayEnd = DateTime.fromISO(workTimeRange.end);

  const breakStart = DateTime.fromISO(breakTimeRange.start);
  const breakEnd = DateTime.fromISO(breakTimeRange.end);

  const avalBucket: any = [];

  const tmpBucket: any = [];

  // if thera are not slot in bucket && dayStart plus eventDuration are smaller then breakStart, then push in the bucket
  while (
    dayStart.plus(eventDuration) <= breakStart &&
    avalBucket.length === 0
  ) {
    avalBucket.push({
      start: dayStart.toUTC(),
      end: dayStart.plus(eventDuration),
    });
  }

  // if thera are not slot in bucket && dayStart piu' eventDuration is bigger then breakStart but breakEnd plus eventDuration is smaller the dayEnd, then push in the bucket
  while (
    dayStart.plus(eventDuration) > breakStart &&
    avalBucket.length === 0 &&
    breakEnd.plus(eventDuration) <= dayEnd
  ) {
    avalBucket.push({
      start: breakStart.toUTC(),
      end: breakStart.plus(eventDuration),
    });
  }

  // if fineUltimoTurno plus eventDuration is smaller then breakStart, then push in bucket
  while (
    avalBucket[avalBucket.length - 1].end
      .plus(eventDuration)
      .plus(breakTimeBtwEvents) <= breakStart
  ) {
    avalBucket.push({
      start: avalBucket[avalBucket.length - 1].end.plus(breakTimeBtwEvents),
      end: avalBucket[avalBucket.length - 1].end
        .plus(eventDuration)
        .plus(breakTimeBtwEvents),
    });
  }

  // if breakEnd plus eventDuration is smaller then dayEnd, then push in bucket
  while (
    breakEnd.plus(eventDuration) <= dayEnd &&
    avalBucket[avalBucket.length - 1].end <= dayEnd &&
    avalBucket[avalBucket.length - 1].end
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
    avalBucket.push({
      start: tmpBucket[tmpBucket.length - 1].start,
      end: tmpBucket[tmpBucket.length - 1].end,
    });
  }
  return avalBucket.map((obj: { start: string; end: string }) => ({
    start: DateTime.fromISO(obj.start).toUTC().toISO(),
    end: DateTime.fromISO(obj.end).toUTC().toISO(),
  }));
};

export const retrieveAvailability = (
  bookedHours: {
    bookings: BookingType[];
  },
  genAval: GeneralAvaliabilityRulesType,
  avalTimeRange?: { start: string; end: string }[]
) => {
  //@ts-expect-error
  const final = filterDays_updateDate(genAval.weekAvalSettings, avalTimeRange);
  if (final.length === 0) return [];
  try {
    const result = createAvalFromBks(
      final[0].availability,
      bookedHours.bookings
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};
