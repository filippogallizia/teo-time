import { DateTime } from 'luxon';

import {
  BookingType,
  DayAvailabilityType,
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

export const DATE_TO_FULL_DAY = (date: string) => {
  return DateTime.fromISO(date).toFormat('yyyy LLL dd');
};

export const joinDayAndTime = (date_day: string, date_time: string) => {
  return DateTime.fromISO(date_day)
    .set({
      hour: FROM_DATE_TO_HOUR(date_time),
      minute: FROM_DATE_TO_MINUTES(date_time),
      second: 0,
      millisecond: 0,
    })
    .toISO();
};

// loop throug general Aval, filter for day with timerange, return availabilities with uploaded date

export const filterDays_updateDate = (
  inputToBeUpdated: DayAvailabilityType[],
  timerange: TimeRangeType[]
): {
  day: string;
  availability: TimeRangeType[];
}[] => {
  const intersection = _.intersectionWith(
    inputToBeUpdated,
    timerange,
    (a: DayAvailabilityType, b: TimeRangeType) => {
      return a.day == FROM_DATE_TO_DAY(b.start);
    }
  );
  return intersection.map((day: DayAvailabilityType) => {
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

/** */

export const removeBksFromAval = (
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

export const retrieveAvailability = (
  bookedHours: {
    bookings: BookingType[];
  },
  genAval: DayAvailabilityType[],
  avalTimeRange: { start: string; end: string }[]
) => {
  const final = filterDays_updateDate(genAval, avalTimeRange);
  if (final.length === 0) return [];
  try {
    return removeBksFromAval(final[0].availability, bookedHours.bookings);
  } catch (e) {
    console.log(e);
  }
};

/**
 * this function create aval slots given the following inputs
 * @param workTimeRange
 * @param breakTimeRange
 * @param eventDuration
 * @param breakTimeBtwEvents
 */

export const avalSlotsFromTimeRange = (
  workTimeRange: TimeRangeType,
  breakTimeRange: TimeRangeType,
  eventDuration: HrsAndMinsType,
  breakTimeBtwEvents: HrsAndMinsType
): TimeRangeType[] => {
  const dayStart = DateTime.fromISO(workTimeRange.start);
  const dayEnd = DateTime.fromISO(workTimeRange.end);

  const breakStart = DateTime.fromISO(breakTimeRange.start);
  const breakEnd = DateTime.fromISO(breakTimeRange.end);

  const avalBucket: { start: DateTime; end: DateTime }[] = [];

  const tmpBucket: { start: DateTime; end: DateTime }[] = [];

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
  return avalBucket.map((obj: { start: DateTime; end: DateTime }) => {
    return {
      start: obj.start.toUTC().toISO(),
      end: obj.end.toUTC().toISO(),
    };
  });
};
