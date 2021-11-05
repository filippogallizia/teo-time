import { TimeRangeType } from '../../../types/Types';

const { DateTime } = require('luxon');

// const myGeneralRules: GeneralAvaliabilityRulesType = {
//   generalAvaliabilityRules: [
//     {
//       day: 'Monday',

//       availability: [
//         {
//           start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
//           end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
//         },
//       ],
//     },
//     {
//       day: 'Tuesday',

//       availability: [
//         {
//           start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
//           end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
//         },
//       ],
//     },
//     {
//       day: 'Wednesday',

//       availability: [
//         {
//           start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
//           end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
//         },
//       ],
//     },
//     {
//       day: 'Thursday',

//       availability: [
//         {
//           start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
//           end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
//         },
//       ],
//     },
//     {
//       day: 'Friday',

//       availability: [
//         {
//           start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
//           end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
//         },
//       ],
//     },
//   ],
// };

// TYPES

type K = {
  hours: number;
  minutes: number;
};

type TimeRangeTypeJson = {
  start: typeof DateTime;
  end: typeof DateTime;
};

type GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: {
    day: string;
    availability: TimeRangeTypeJson[];
  }[];
};

const COEFFICIENT = {
  hours: 1,
  minutes: 30,
};

// const useCoefficientToCreateSlots = (timeRanges: TimeRangeTypeJson[], k: K) => {
//   const bucket: any[] = [];
//   return function closurfFn() {
//     timeRanges.forEach((timeRange) => {
//       if (bucket.length === 0) {
//         bucket.push({
//           start: DateTime.fromISO(timeRange.start).toISO(),
//           end: DateTime.fromISO(timeRange.start).plus(k).toISO(),
//         });
//       }

//       while (
//         // fine del range e' maggiore della fine del bukcet && fine del range - la fine del bucket e' >= al coefficiente
//         timeRange.end > bucket[bucket.length - 1].end &&
//         DateTime.fromISO(timeRange.end).diff(
//           DateTime.fromISO(bucket[bucket.length - 1].end),
//           ['hours', 'minutes']
//         ).values.hours >= k.hours
//       ) {
//         bucket.push({
//           start: bucket[bucket.length - 1].end,
//           end: DateTime.fromISO(bucket[bucket.length - 1].end)
//             .plus(k)
//             .toISO(),
//         });
//       }
//     });
//     return bucket;
//   };
// };

// console.log(
//   useCoefficientToCreateSlots(
//     [
//       {
//         start: '2021-10-04T07:30:00.000Z',
//         end: '2021-10-04T08:15:00.000Z',
//       },
//       {
//         start: '2021-10-04T08:30:00.000Z',
//         end: '2021-10-04T17:30:00.000Z',
//       },
//     ],
//     { hours: 0, minutes: 45 }
//   )()
// );

// const getGeneralAvaliabilityInSlots = (
//   myGeneralRules: GeneralAvaliabilityRulesType
// ) => {
//   return myGeneralRules.generalAvaliabilityRules.map((slot) => {
//     const getAvailabilityInSlots = useCoefficientToCreateSlots(
//       slot.availability,
//       COEFFICIENT
//     );
//     return {
//       day: slot.day,
//       availability: getAvailabilityInSlots(),
//     };
//   });
// };

// var minutesOfDay = function (m: any) {
//   console.log(m.minutes, 'minutes');
//   console.log(m.hours, 'hours');
//   return m.minutes + m.hours * 60;
// };

// const useCoefficientToCreateSlots2 = (
//   timeRanges: TimeRangeTypeJson[],
//   k: K,
//   kBreaks: {
//     before: { hours: number; minutes: number };
//     after: { hours: number; minutes: number };
//   }
// ) => {
//   const bucket: any[] = [];
//   return function closurfFn() {
//     timeRanges.forEach((timeRange) => {
//       if (bucket.length === 0) {
//         bucket.push({
//           start: DateTime.fromISO(timeRange.start).toUTC().toISO(),
//           end: DateTime.fromISO(timeRange.start).plus(k).toUTC().toISO(),
//         });
//       }

//       while (
//         DateTime.fromISO(timeRange.end) >
//           DateTime.fromISO(bucket[bucket.length - 1].end).plus(kBreaks.after) &&
//         minutesOfDay(
//           DateTime.fromISO(timeRange.end)
//             .minus(kBreaks.before)
//             .diff(DateTime.fromISO(bucket[bucket.length - 1].end), [
//               'hours',
//               'minutes',
//             ]).values
//         ) >= minutesOfDay(k)
//       ) {
//         if (
//           minutesOfDay(
//             DateTime.fromISO(timeRange.start).diff(
//               DateTime.fromISO(bucket[bucket.length - 1].end),
//               ['hours', 'minutes']
//             ).values
//           ) >= minutesOfDay(k)
//         ) {
//           console.log('here');
//           bucket.push({
//             start: DateTime.fromISO(timeRange.start).toUTC().toISO(),
//             end: DateTime.fromISO(timeRange.start).plus(k).toUTC().toISO(),
//           });
//         }
//         bucket.push({
//           start: bucket[bucket.length - 1].end,
//           end: DateTime.fromISO(bucket[bucket.length - 1].end)
//             .plus(k)
//             .toUTC()
//             .toISO(),
//         });
//       }
//     });
//     return bucket;
//   };
// };

const compareTwoDatesWithK = (
  date1: TimeRangeType,
  date2: TimeRangeType,
  k: K
  // kBreaks: {
  //   before: { hours: number; minutes: number };
  //   after: { hours: number; minutes: number };
  // }
) => {
  const inizioGiornata = DateTime.fromISO(date1.start);
  const fineGiornata = DateTime.fromISO(date1.end);

  const inizioLimite = DateTime.fromISO(date2.start);
  const fineLimite = DateTime.fromISO(date2.end);

  const contenitoreTurni: any = [];

  const tmpBucket: any = [];

  // if thera are not slot in bucket && inizioGiornata piu' k are smaller then inizioLimite, then push in the bucket
  while (
    inizioGiornata.plus(k) < inizioLimite &&
    contenitoreTurni.length === 0
  ) {
    contenitoreTurni.push({
      start: inizioGiornata.toUTC(),
      end: inizioGiornata.plus(k),
    });
  }

  // if thera are not slot in bucket && inizioGiornata piu' k is bigger then inizioLimite but fineLimite plus k is smaller the fineGiornata, then push in the bucket

  while (
    inizioGiornata.plus(k) > inizioLimite &&
    contenitoreTurni.length === 0 &&
    fineLimite.plus(k) < fineGiornata
  ) {
    contenitoreTurni.push({
      start: inizioLimite.toUTC(),
      end: inizioLimite.plus(k),
    });
  }

  // if fineUltimoTurno plus k is smaller then inizioLimite, then push in bucket

  while (
    contenitoreTurni[contenitoreTurni.length - 1].end.plus(k) < inizioLimite
  ) {
    contenitoreTurni.push({
      start: contenitoreTurni[contenitoreTurni.length - 1].end,
      end: contenitoreTurni[contenitoreTurni.length - 1].end.plus(k),
    });
  }

  // if fineLimite plus k is smaller then fineGiornata, then push in bucket

  while (
    fineLimite.plus(k) < fineGiornata &&
    contenitoreTurni[contenitoreTurni.length - 1].end < fineGiornata
  ) {
    if (tmpBucket.length === 0) {
      tmpBucket.push({
        start: fineLimite,
        end: fineLimite.plus(k),
      });
    } else {
      tmpBucket.push({
        start: tmpBucket[tmpBucket.length - 1].end,
        end: tmpBucket[tmpBucket.length - 1].end.plus(k),
      });
    }
    contenitoreTurni.push({
      start: tmpBucket[tmpBucket.length - 1].start,
      end: tmpBucket[tmpBucket.length - 1].end,
    });
  }
  return contenitoreTurni.map((obj: { start: Date; end: Date }) => ({
    start: DateTime.fromISO(obj.start).toUTC().toISO(),
    end: DateTime.fromISO(obj.end).toUTC().toISO(),
  }));
};

console.log(
  compareTwoDatesWithK(
    {
      start: '2021-10-04T07:30:00.000Z',
      end: '2021-10-04T21:15:00.000Z',
    },
    {
      start: '2021-10-04T16:30:00.000Z',
      end: '2021-10-04T19:30:00.000Z',
    },

    { hours: 2, minutes: 45 }
  )
);
