import { DateTime } from 'luxon';
import {
  GeneralAvailabilityType,
  GeneralAvailabilityTypes,
  GeneralAvaliabilityRulesType,
  TimeRangeType,
} from '../types/Types';
const _ = require('lodash');

export const HOUR_MINUTE_FORMAT = (value: string): string => {
  return DateTime.fromISO(value).toFormat('HH:mm');
};

export const FROM_DATE_TO_HOUR = (date: string) => {
  return DateTime.fromISO(date).hour;
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

export const filterForDays = (
  genAv: GeneralAvaliabilityRulesType,
  timeRange: TimeRangeType[]
): {
  day: string;
  availability: TimeRangeType[];
}[] => {
  console.log(genAv.generalAvaliabilityRules, 'ciao');
  console.log(timeRange, 'timeRange');
  return _.intersectionWith(
    genAv.generalAvaliabilityRules,
    timeRange,
    (a: GeneralAvailabilityType, b: TimeRangeType) => {
      console.log(a, b);
      return a.day == FROM_DATE_TO_DAY(b.start);
    }
  );
};
