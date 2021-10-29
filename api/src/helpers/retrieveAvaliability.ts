const _ = require('lodash');
import { filterForDays, HOUR_MINUTE_FORMAT } from '../../utils';
import { GeneralAvaliabilityRulesType } from '../types/generalTypes';

export const retrieveAvailability = (
  bookedHours: {
    bookings: {
      id: number;
      start: string;
      end: string;
      createdAt: string;
      updatedAt: string;
    }[];
  },
  genAv: GeneralAvaliabilityRulesType,
  timeRange?: { start: string; end: string }[]
) => {
  // if there aren't booking, retrieve the  all availabilities for the time range
  if (bookedHours.bookings.length === 0 && timeRange) {
    const matched = filterForDays(genAv, timeRange);
    if (matched.length === 0) {
      return [];
    }
    // scenario one day
    return matched[0].availability;
  } else {
    const matched = filterForDays(genAv, bookedHours.bookings);
    if (matched.length === 0) {
      return [];
    }
    const result = _.differenceWith(
      // scenario one day
      matched[0].availability,
      bookedHours.bookings,
      (a: any, b: any) =>
        HOUR_MINUTE_FORMAT(a.start) == HOUR_MINUTE_FORMAT(b.start)
    );

    return result;
  }
};

// START OF NEW ALGORITM

// const result = _.differenceWith(
//   matched[0].availability,
//   bookedHours.bookings,
//   (a: any, b: any) => {
//     if (
//       (HOUR_MINUTE_FORMAT(a.start) >= HOUR_MINUTE_FORMAT(b.start) &&
//         HOUR_MINUTE_FORMAT(a.end) <= HOUR_MINUTE_FORMAT(b.end)) ||
//       (HOUR_MINUTE_FORMAT(a.start) <= HOUR_MINUTE_FORMAT(b.start) &&
//         HOUR_MINUTE_FORMAT(a.end) >= HOUR_MINUTE_FORMAT(b.start)) ||
//       (HOUR_MINUTE_FORMAT(a.start) <= HOUR_MINUTE_FORMAT(b.end) &&
//         HOUR_MINUTE_FORMAT(a.end) >= HOUR_MINUTE_FORMAT(b.end))
//     ) {
//       return true;
//     }
//   }
// );
