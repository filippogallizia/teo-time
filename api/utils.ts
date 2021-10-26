import { DateTime } from 'luxon';
const _ = require('lodash');

export const HOUR_MINUTE_FORMAT = (value: string): string => {
  return DateTime.fromISO(value).toFormat('HH:mm');
};

export const FROM_DATE_TO_HOUR = (date: string) => {
  return DateTime.fromISO(date).hour;
};

export const FROM_DATE_TO_DAY = (date: string) => {
  return DateTime.fromISO(date).weekdayLong;
};

export const filterForDays = (
  genAv: GeneralAvaliabilityRulesType,
  timeRange: { start: string; end: string }[]
): {
  day: string;
  availability: TimeRangeTypeJson[];
}[] => {
  return _.intersectionWith(
    genAv.generalAvaliabilityRules,
    timeRange,
    (a: any, b: any) => {
      return a.day == FROM_DATE_TO_DAY(b.start);
    }
  );
};
