import { stringify } from 'querystring';

import { DateTime } from 'luxon';

import {
  GeneralAvailabilityType,
  GeneralAvaliabilityRulesType,
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

export const filterForDays = (
  genAv: GeneralAvaliabilityRulesType,
  timerange: TimeRangeType[]
): {
  day: string;
  availability: TimeRangeType[];
}[] => {
  return _.intersectionWith(
    genAv.weekAvalSettings,
    timerange,
    (a: GeneralAvailabilityType, b: TimeRangeType) => {
      return a.day == FROM_DATE_TO_DAY(b.start);
    }
  ).map((day: GeneralAvailabilityType) => {
    const parseAvailabilities = day.availability.map(
      (a: { start: string; end: string }) => {
        return {
          start: DateTime.fromISO(timerange[0].start)
            .set({
              hour: FROM_DATE_TO_HOUR(a.start),
              minute: FROM_DATE_TO_MINUTES(a.start),
              second: 0,
              millisecond: 0,
            })
            .toISO(),
          end: DateTime.fromISO(timerange[0].end)
            .set({
              hour: FROM_DATE_TO_HOUR(a.end),
              minute: FROM_DATE_TO_MINUTES(a.end),
              second: 0,
              millisecond: 0,
            })
            .toISO(),
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
