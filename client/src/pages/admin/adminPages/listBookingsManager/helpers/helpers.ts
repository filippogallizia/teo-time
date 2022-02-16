import { DateTime } from 'luxon';
import { FROM_DATE_TO_DAY } from '../../../../../helpers/utils';
import { FixedBookingDTO } from '../../fixedBookingsManager/FixedBookingsManagerApi';

export const createStartAndEndDate = (date: Date) => {
  return {
    start: DateTime.fromJSDate(date)
      .set({
        hour: 0,
        minute: 0,
        millisecond: 0,
      })
      .toUTC()
      .toString(),
    end: DateTime.fromJSDate(date)
      .set({
        hour: 23,
        minute: 0,
        millisecond: 0,
      })
      .toUTC()
      .toString(),
  };
};

export const createWeekFromDate = (date: DateTime): string[] => {
  const week = [];

  (function () {
    for (let x = 0; x < 7; x++) {
      if (week.length === 0) {
        week.push(date).toString();
      } else {
        let lastDate: DateTime = week[week.length - 1];
        week.push(lastDate.plus({ days: 1 }));
      }
    }
  })();

  return week.map((d) => d.toString());
};

export const giveDateToFixBooking = (
  fixedBkgs: FixedBookingDTO[]
): FixedBookingDTO[] => {
  const weekFromToday: string[] = createWeekFromDate(DateTime.now());

  return fixedBkgs.map((bkg) => {
    const [hoursStart, minutesStart] = bkg.start.split(':');
    const [hoursEnd, minutesEnd] = bkg.end.split(':');

    const matchedDay = weekFromToday.find((day) => {
      return FROM_DATE_TO_DAY(day) === bkg.day;
    });
    if (matchedDay) {
      return {
        ...bkg,
        start: DateTime.fromISO(matchedDay)
          .set({
            hour: Number(hoursStart),
            minute: Number(minutesStart),
          })
          .toString(),
        end: DateTime.fromISO(matchedDay)
          .set({
            hour: Number(hoursEnd),
            minute: Number(minutesEnd),
          })
          .toString(),
      };
    } else return bkg;
  });
};

const addNDaysToDate = (nDays: number, date: string) => {
  return DateTime.fromISO(date).plus({ days: nDays }).toString();
};

export const createFixedBoookingForAllYear = (
  fixedBkgsWithCompleteDate: FixedBookingDTO[]
) => {
  const currentYear = DateTime.now().year;
  const lastDayOfyear = DateTime.utc(currentYear, 12, 31).toString();
  let result = Object.assign(fixedBkgsWithCompleteDate, {});

  let counter = 0;

  while (result[result.length - 1].start.toString() < lastDayOfyear) {
    result.push({
      ...result[counter],
      id: result[counter].id + 1000,
      day: FROM_DATE_TO_DAY(addNDaysToDate(7, result[counter].start)),
      start: addNDaysToDate(7, result[counter].start),
    });

    counter++;
  }

  return result;
};

export const filterJustFutureDates = (date: string) => {
  return (
    new Date(date) >=
    DateTime.fromJSDate(new Date())
      .set({
        hour: 0,
        minute: 0,
        millisecond: 0,
      })
      .toJSDate()
  );
};
