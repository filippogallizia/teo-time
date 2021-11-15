const _ = require('lodash');
import { filterForDays } from '../../utils';
import { GeneralAvaliabilityRulesType } from '../types/types';

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
  genAval: GeneralAvaliabilityRulesType,
  avalTimeRange?: { start: string; end: string }[]
) => {
  //@ts-expect-error
  const final = filterForDays(genAval, avalTimeRange);

  try {
    const result = _.differenceWith(
      // scenario one day
      final[0].availability,
      bookedHours.bookings,
      (aval: any, bks: any) => {
        return (
          (bks.start <= aval.start && bks.end >= aval.end) ||
          (bks.start >= aval.start && bks.start < aval.end) ||
          (bks.end >= aval.start && bks.end < aval.end)
        );
      }
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};
