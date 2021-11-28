const _ = require('lodash');

import { createAvalFromBks, filterDays_updateDate } from '../../utils';
import { BookingType, GeneralAvaliabilityRulesType } from '../types/types';

export const retrieveAvailability = (
  bookedHours: {
    bookings: BookingType[];
  },
  genAval: GeneralAvaliabilityRulesType,
  avalTimeRange?: { start: string; end: string }[]
) => {
  //@ts-expect-error
  const final = filterDays_updateDate(genAval.weekAvalSettings, avalTimeRange);
  if (final.length === 0) return [];
  try {
    const result = createAvalFromBks(
      final[0].availability,
      bookedHours.bookings
    );
    return result;
  } catch (e) {
    console.log(e);
  }
};
