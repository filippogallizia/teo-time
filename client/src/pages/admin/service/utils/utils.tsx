import { DateTime } from 'luxon';
import { UserType } from '../../../../../types/Types';

const orderBookingsByDate = (response: any) => {
  const allBookingsParsedByDate: [
    {
      id: number;
      start: string;
      end: string;
      userId: number;
      user: UserType;
    }[]
  ] = response.reduce((acc: any, cv: any) => {
    if (acc.length === 0) {
      acc.push([cv]);
    }
    const lastOne = acc[acc.length - 1];
    if (
      DateTime.fromISO(lastOne[lastOne.length - 1].start).day ===
        DateTime.fromISO(cv.start).day &&
      lastOne[lastOne.length - 1].start !== cv.start
    ) {
      lastOne.push(cv);
    }
    if (
      DateTime.fromISO(lastOne[lastOne.length - 1].start).day !==
      DateTime.fromISO(cv.start).day
    ) {
      acc.push([cv]);
    }
    return acc;
  }, []);
  return allBookingsParsedByDate;
};
