import { fromIsoDateToDay, fromIsoDateToHour } from '../../utils';
const { DateTime } = require('luxon');
const _ = require('lodash');

//helpers

export const matchTimeRangeAndAvailability = (
  genAv: GeneralAvaliabilityRulesType,
  timeRange: { start: string; end: string }
): {
  day: string;
  availability: TimeRangeTypeJson[];
}[] => {
  return _.filter(
    genAv.generalAvaliabilityRules,
    (el: any) => el.day == fromIsoDateToDay(timeRange.start)
  );
};

//types

export const getAvailabilityFromBooking = (
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
  timeRange?: { start: string; end: string }
) => {
  // if there aren't booking, retrieve the  all availabilities for the time range
  if (bookedHours.bookings.length === 0 && timeRange) {
    // const matchTimeRangeAndAvailability = _.filter(
    //   genAv.generalAvaliabilityRules,
    //   (el: { day: string; availability: TimeRangeTypeJson[] }) =>
    //     el.day.toLowerCase() ===
    //     DateTime.fromISO(timeRange.start).weekdayLong.toLowerCase()
    // );
    const matched = matchTimeRangeAndAvailability(genAv, timeRange);
    return matched[0].availability;
  } else {
    // const matchDayBookingAndAvailability =
    //   genAv.generalAvaliabilityRules.filter((el) => {
    //     return bookedHours.bookings.find((hours) => {
    //       return el.day == fromIsoDateToDay(hours.start);
    //     });
    //   });
    const matched = _.intersectionWith(
      genAv.generalAvaliabilityRules,
      bookedHours.bookings,
      (a, b) => a.day == fromIsoDateToDay(b.start)
    );

    const result = _.xorWith(
      matched[0].availability,
      bookedHours.bookings,
      (a: any, b: any) =>
        fromIsoDateToHour(a.start) == fromIsoDateToHour(b.start)
    );
    return result;
  }
};
