import { fromIsoDateToDay, fromIsoDateToHour } from '../../utils';
import { TimeRangeType } from '../types/generalTypes';

const generalAvaliabilityRules = require('../config/timeConditions.config.json');
const { DateTime } = require('luxon');
const _ = require('lodash');

//helpers

export const matchTimeRangeAndAvailability = (
  genAv: GeneralAvaliabilityRulesType,
  timeRange: string
) => {
  return _.filter(
    genAv.generalAvaliabilityRules,
    (el: any) =>
      el.day.toLowerCase() ===
      DateTime.fromISO(timeRange).weekdayLong.toLowerCase()
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
    const matchTimeRangeAndAvailability = _.filter(
      genAv.generalAvaliabilityRules,
      (el: any) =>
        el.day.toLowerCase() ===
        DateTime.fromISO(timeRange.start).weekdayLong.toLowerCase()
    );
    return matchTimeRangeAndAvailability[0].availability;
  } else {
    const matchDayBookingAndAvailability =
      genAv.generalAvaliabilityRules.filter((el) => {
        return bookedHours.bookings.find((hours) => {
          // return el.day == DateTime.fromISO(hours.start).weekdayLong;
          return el.day == fromIsoDateToDay(hours.start);
        });
      });

    const result = _.xorWith(
      matchDayBookingAndAvailability[0].availability,
      bookedHours.bookings,
      (a: any, b: any) =>
        fromIsoDateToHour(a.start) == fromIsoDateToHour(b.start)
    );
    return result;
  }
};
