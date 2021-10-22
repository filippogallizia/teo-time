import { DateTime } from 'luxon';

export const fromIsoDateToHourMinute = (value: string): string => {
  return DateTime.fromISO(value).toFormat('HH:mm');
};

export const fromIsoDateToHour = (date: string) => {
  return DateTime.fromISO(date).hour;
};

export const fromIsoDateToDay = (date: string) => {
  return DateTime.fromISO(date).weekdayLong;
};
