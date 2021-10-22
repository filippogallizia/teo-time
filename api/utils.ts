import { DateTime } from 'luxon';
const _ = require('lodash');

export const fromIsoDateToHourMinute = (value: string): string => {
  return DateTime.fromISO(value).toFormat('HH:mm');
};

export const fromIsoDateToHour = (date: string) => {
  return DateTime.fromISO(date).hour;
};

export const fromIsoDateToDay = (date: string) => {
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
    (a: any, b: any) => a.day == fromIsoDateToDay(b.start)
  );
};
