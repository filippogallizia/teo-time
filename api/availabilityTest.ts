const weekAvalSettings = require('../config/timeConditions.config.json');
const { DateTime } = require('luxon');
const _ = require('lodash');
import { TimeRangeType } from '../types/Types';

//types

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
  TimeRangeType?: { start: string; end: string }
) => {
  // if there aren't booking, retrieve the  all availabilities for the time range
  if (bookedHours.bookings.length === 0 && TimeRangeType) {
    const filterForDays = _.filter(
      genAv.weekAvalSettings,
      (el: any) =>
        el.day.toLowerCase() ===
        DateTime.fromISO(TimeRangeType.start).weekdayLong.toLowerCase()
    );
    return filterForDays[0].availability;
  } else {
    // condition to compare bookings and availabilities

    const isSameHour = (a: TimeRangeType, b: TimeRangeType) => {
      return DateTime.fromISO(a.start).hour == DateTime.fromISO(b.start).hour;
    };
    // in between the booking provided, retrieve the availabilities with the same weekDay.

    const matchDayBookingAndAvailability = _.intersectionWith(
      genAv.weekAvalSettings,
      bookedHours.bookings,
      (a: any, b: any) => {
        const startParsed = b.start.toISOString();
        return (
          a.day.toLowerCase() ===
          DateTime.fromISO(startParsed).weekdayLong.toLowerCase()
        );
      }
    );
    const availabilities = matchDayBookingAndAvailability[0].availability;
    const bookings = bookedHours.bookings;

    // parse the date to string ( they come from mySQL so they are objects)
    const parsedBooking = bookings.map((hour) => {
      //@ts-expect-error
      const startParsed = hour.start.toISOString();
      //@ts-expect-error
      const endParsed = hour.end.toISOString();
      return {
        ...hour,
        start: DateTime.fromISO(startParsed),
        end: DateTime.fromISO(endParsed),
      };
    });

    return _.xorWith(availabilities, parsedBooking, isSameHour);
  }
};
