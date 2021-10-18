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
  ) => {
    return left.filter(
      (leftValue) =>
        !right.some((rightValue) => compareFunction(leftValue, rightValue))
    );
  };

  // const compareBookingAndAvailabiliy = (
  //   left: any[],
  //   right: any[]
  //   // compareFunction: (a: any, b: any) => boolean
  // ) => {
  //   const bucket: any = [];
  //   const findUnique = left.forEach((arrVal) => {
  //     let exist = false;
  //     right.forEach((arr1Val) => {
  //       if (
  //         DateTime.fromISO(arr1Val.start).hour ==
  //         DateTime.fromISO(arrVal.start).hour
  //       ) {
  //         exist = true;
  //       }
  //       if (
  //         DateTime.fromISO(arr1Val.start).hour !==
  //           DateTime.fromISO(arrVal.start).hour &&
  //         exist
  //       ) {
  //         bucket.push(arrVal);
  //       }
  //     });
  //   });
  //   return bucket;
  // };

  const matchDayBookingAndAvailability = genAv.generalAvaliabilityRules.filter(
    (el) => {
      return bookedHours.bookings.find((hours) => {
        //@ts-expect-error
        const ciao = hours.start.toISOString();
        console.log(DateTime.fromISO(ciao).weekdayLong.toLowerCase(), 'ciao');
        // const ciao = hours.start;
        return (
          el.day.toLowerCase() ===
          DateTime.fromISO(ciao).weekdayLong.toLowerCase()
        );
      });
    }
  );

  console.log(
    JSON.stringify(matchDayBookingAndAvailability),
    'matchDayBookingAndAvailability'
  );

  const availabilities = matchDayBookingAndAvailability[0].availability;
  const bookings = bookedHours.bookings;

  console.log(bookings, 'bookings');
  const parsedBooking = bookings.map((hour) => {
    //@ts-expect-error
    const x = hour.start.toISOString();
    //@ts-expect-error
    const y = hour.end.toISOString();
    return {
      ...hour,
      start: DateTime.fromISO(x),
      end: DateTime.fromISO(y),
    };
  });

  console.log(parsedBooking, 'parsedBooking');

  const filtered1 = compareBookingAndAvailabiliy(
    availabilities,
    parsedBooking,
    isSameHour
  );
  const fitered2 = compareBookingAndAvailabiliy(
    parsedBooking,
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
    const result = getAvailabilityFromBooking(
      {
        // bookings: [
        //   {
        //     id: 1,
        //     start: '2021-10-05T07:00:00.000',
        //     end: '2021-10-05T08:30:00.000',
        //     createdAt: '2021-10-18T09:08:59.000Z',
        //     updatedAt: '2021-10-18T09:08:59.000Z',
        //   },
        //   {
        //     id: 1,
        //     start: '2021-10-05T08:30:00.000',
        //     end: '2021-10-05T10:00:00.000',
        //     createdAt: '2021-10-18T09:08:59.000Z',
        //     updatedAt: '2021-10-18T09:08:59.000Z',
        //   },
        // ],
        bookings: filo,
      },
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
//         {
//           id: 1,
//           start: '2021-10-05T07:30:00.000Z',
//           end: '2021-10-05T08:30:00.000Z',
//           createdAt: '2021-10-18T09:08:59.000Z',
//           updatedAt: '2021-10-18T09:08:59.000Z',
//         },
//       ],
//     },

//     generalAvaliabilityRules
//   )
// );
