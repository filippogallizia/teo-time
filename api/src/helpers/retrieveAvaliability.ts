const generalAvaliabilityRules = require('../config/timeConditions.config.json');
const { DateTime } = require('luxon');
import { Op } from 'sequelize';
const db = require('../models/db');

const BookingGrid = db.bookingGrid;

//types

type TimeRangeType = {
  start: Date;
  end: Date;
};

type GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: {
    day: string;
    availability: TimeRangeType[];
  }[];
};

type BookedHoursType = {
  bookings: TimeRangeType[];
};

const bookedHours: BookedHoursType = {
  bookings: [
    {
      start: DateTime.fromISO('2021-09-05T09:00:00.000'),
      end: DateTime.fromISO('2021-10-05T11:00:00.000'),
    },
    {
      start: DateTime.fromISO('2021-10-05T13:00:00.000'),
      end: DateTime.fromISO('2021-10-05T15:00:00.000'),
    },
  ],
};

// helpers

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
  genAv: GeneralAvaliabilityRulesType
) => {
  const isSameHour = (a: TimeRangeType, b: TimeRangeType) => {
    return DateTime.fromISO(a.start).hour == DateTime.fromISO(b.start).hour;
  };

  const compareBookingAndAvailabiliy = (
    left: any[],
    right: any[],
    compareFunction: (a: any, b: any) => boolean
  ) =>
    left.filter(
      (leftValue) =>
        !right.some((rightValue) => compareFunction(leftValue, rightValue))
    );

  const matchDayBookingAndAvailability = genAv.generalAvaliabilityRules.filter(
    (el) => {
      return bookedHours.bookings.find((hours) => {
        const ciao = hours.start;
        console.log(
          DateTime.local(ciao).weekdayLong.toLocaleLowerCase(),
          'hours'
        );
        return (
          el.day.toLocaleLowerCase() ===
          DateTime.local(hours.start).weekdayLong.toLocaleLowerCase()
        );
      });
    }
  );

  console.log(matchDayBookingAndAvailability, 'matchDayBookingAndAvailability');

  const availabilities = matchDayBookingAndAvailability[0].availability;
  const bookings = bookedHours.bookings;

  const filtered1 = compareBookingAndAvailabiliy(
    availabilities,
    bookings,
    isSameHour
  );
  const fitered2 = compareBookingAndAvailabiliy(
    bookings,
    availabilities,
    isSameHour
  );

  return [...filtered1, ...fitered2];
};

const findBooking = async () => {
  const startRange = '2021-10-05T07:00:00.000';
  const endRange = '2021-10-05T09:30:00.000';
  try {
    const filo = await BookingGrid.findAll({
      where: {
        start: {
          [Op.gte]: startRange,
        },
        end: {
          [Op.lte]: endRange,
        },
      },
    }).catch((e: any) => {
      console.log(e);
    });
    console.log(filo, 'filo');
    const result = getAvailabilityFromBooking(
      { bookings: filo },
      generalAvaliabilityRules
    );
    console.log(result, 'result');
  } catch (e) {
    console.log(e, 'e2');
  }
};

findBooking();

// console.log(
//   getAvailabilityFromBooking(
//     {
//       bookings: [
//         {
//           id: 1,
//           start: '2021-10-05T06:00:00.000Z',
//           end: '2021-10-05T08:30:00.000Z',
//           createdAt: '2021-10-18T09:08:59.000Z',
//           updatedAt: '2021-10-18T09:08:59.000Z',
//         },
//       ],
//     },

//     generalAvaliabilityRules
//   )
// );
