import { DateTime } from 'luxon';
import { HrsAndMinsType } from '../../types/Types';

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

export const DATE_TO_DAY_FORMAT = (date: string) => {
  return DateTime.fromISO(date).toFormat('yyyy LLL dd');
};

export const DATE_TO_DATE_AT_END_OF_DAY = (date: DateTime) => {
  return date
    .set({
      hour: 23,
      minute: 59,
      second: 0,
      millisecond: 0,
    })
    .toISO();
};

export const DATE_TO_DATE_AT_START_OF_DAY = (date: DateTime) => {
  return date
    .set({
      hour: 1,
      minute: 1,
      second: 1,
      millisecond: 0,
    })
    .toISO();
};

export const SET_DATE_TO_MIDNIGHT = (date: string) => {
  return DateTime.fromISO(date)
    .set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .toUTC()
    .toString();
};

export const TODAY_AT_MIDNIGHT = () => {
  return DateTime.fromJSDate(new Date()).set({
    hour: 0,
    minute: 0,
    millisecond: 0,
  });
};

export const parseHoursToObject = (selectedHour: string): HrsAndMinsType => {
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

export const promptConfirmation = (): boolean => {
  // eslint-disable-next-line no-restricted-globals
  const confirmation = confirm('Sei sicuro che voui cancellare?');
  if (!confirmation) return false;
  else return true;
};
