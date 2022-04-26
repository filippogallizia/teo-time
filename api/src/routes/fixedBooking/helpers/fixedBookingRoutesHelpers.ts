import { DateTime } from 'luxon';

import { FixedBookingDTO } from '../../../services/fixedBookingService/interfaces';
import { FROM_DATE_TO_DAY } from '../../../utils';

export const createWeekFromDate = (date: string): string[] => {
  const week = [];

  (function () {
    for (let x = 0; x < 7; x++) {
      if (week.length === 0) {
        week.push(date);
      } else {
        const lastDate: string = week[week.length - 1];
        week.push(
          DateTime.fromISO(lastDate, { setZone: true })
            .plus({ days: 1 })
            .toISO()
        );
      }
    }
  })();

  return week.map((d) => d.toString());
};

export const giveDateToFixBooking = (
  fixedBkgs: FixedBookingDTO[],
  dateFromClient: string
): FixedBookingDTO[] => {
  const zone = DateTime.fromISO(dateFromClient, {
    setZone: true,
  }).toISO();

  const weekFromToday: string[] = createWeekFromDate(zone);

  return fixedBkgs.map((bkg) => {
    const [hoursStart, minutesStart] = bkg.start.split(':');
    const [hoursEnd, minutesEnd] = bkg.end.split(':');

    const matchedDay = weekFromToday.find((day) => {
      return FROM_DATE_TO_DAY(day) === bkg.day;
    });

    if (matchedDay) {
      return {
        ...bkg,
        start: DateTime.fromISO(matchedDay, { setZone: true })
          .set({
            hour: Number(hoursStart),
            minute: Number(minutesStart),
            second: 0,
            millisecond: 0,
          })
          .toString(),
        end: DateTime.fromISO(matchedDay, { setZone: true })
          .set({
            hour: Number(hoursEnd),
            minute: Number(minutesEnd),
            second: 0,
            millisecond: 0,
          })
          .toString(),
      };
    } else return bkg;
  });
};
