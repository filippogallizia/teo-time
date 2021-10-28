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

export const DATE_TO_CLIENT_FORMAT = (date: string) => {
  return DateTime.fromISO(date).toFormat('yyyy LLL dd t');
};

export const parseHoursToObject = (
  selectedHour: string
): { hours: number; minutes: number } => {
  let flag = false;
  let wasZero = false;
  const result = selectedHour.split('').reduce(
    (acc: any, cv: string) => {
      if (cv === ':') {
        flag = true;
        return acc;
      }
      if (acc.hours.length === 0 && cv === '0') {
        return acc;
      }
      if (acc.hours.length === 2 || wasZero) {
        acc.minutes.push(cv);
        return acc;
      }
      if (acc.hours.length === 1 && flag) {
        acc.minutes.push(cv);
        return acc;
      }
      if (flag) return acc;
      acc.hours.push(cv);
      return acc;
    },
    { hours: [], minutes: [] }
  );
  const minutesInNumber = Number(result.minutes.join(''));
  const hoursInNumber = Number(result.hours.join(''));
  result.minutes = minutesInNumber;
  result.hours = hoursInNumber;
  return result;
};
