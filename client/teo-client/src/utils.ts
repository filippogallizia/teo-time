import { DateTime } from 'luxon';

export const FROM_DATE_TO_HOUR = (date: string) => {
  return DateTime.fromISO(date).hour;
};

export const FROM_DATE_TO_DAY = (date: string) => {
  return DateTime.fromISO(date).weekdayLong;
};

export const HOUR_MINUTE_FORMAT = (date: string) => {
  return DateTime.fromISO(date).toFormat('HH:mm');
};
