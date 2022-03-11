import { DateTime } from 'luxon';

import { BookingType, DayAvailabilityType, TimeRangeType } from './types/types';

const _ = require('lodash');

const currentYear = DateTime.now().year;
export const lastDayOfyear = DateTime.utc(currentYear, 12, 31);

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
  const zone = DateTime.fromISO(date_day, {
    setZone: true,
  }).zoneName;

  return DateTime.fromISO(date_day, { zone })
    .set({
      hour: FROM_DATE_TO_HOUR(date_time),
      minute: FROM_DATE_TO_MINUTES(date_time),
      second: 0,
      millisecond: 0,
    })
    .toISO();
};

export const setTimeToDate = (date: string, time: string): string => {
  const [hoursStart, minutesStart] = time.split(':');
  //TODO verify all works with this setZone
  const newDateTime = DateTime.fromISO(date)
    .set({
      hour: Number(hoursStart),
      minute: Number(minutesStart),
      second: 0,
      millisecond: 0,
    })
    .toISO();

  return newDateTime;
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
      console.log(inputToBeUpdated[0], 'a start');
      console.log(timerange);
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
    console.log(parseAvailabilities, 'parseAvailabilities');
    return {
      ...day,
      date: timerange[0],
      availability: parseAvailabilities,
    };
  });
};

// use this function to create availabilities after comparing them with existing bookings

/**
 * differenceWith creates an array of array values not included in the other given arrays
 */

//TODO -> TEST THIS ONE

export const removeBksFromAval = (
  availabilities: TimeRangeType[],
  bookings: TimeRangeType[]
) => {
  return _.differenceWith(
    // scenario one day
    availabilities,
    bookings,
    (aval: any, bks: any) => {
      console.log(bks.end, 'bks.end');
      console.log(aval.start, '-', aval.end, 'aval.start');
      return (
        (bks.start <= aval.start && bks.end >= aval.end) ||
        (bks.start >= aval.start && bks.start < aval.end) ||
        (bks.end > aval.start && bks.end < aval.end)
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
  //console.log(genAval, 'genAval');
  const final = filterDays_updateDate(genAval, avalTimeRange);
  if (final.length === 0) return [];
  try {
    //console.log(final[0], 'final');
    return removeBksFromAval(final[0].availability, bookedHours.bookings);
  } catch (e) {
    console.log(e);
  }
};
