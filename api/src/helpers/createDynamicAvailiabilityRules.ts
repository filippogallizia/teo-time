const { DateTime } = require('luxon');

const myGeneralRules: GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: [
    {
      day: 'Monday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
          end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
        },
      ],
    },
    {
      day: 'Tuesday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
          end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
        },
      ],
    },
    {
      day: 'Wednesday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
          end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
        },
      ],
    },
    {
      day: 'Thursday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
          end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
        },
      ],
    },
    {
      day: 'Friday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000').toUTC(),
          end: DateTime.fromISO('2021-10-05T21:00:00.000').toUTC(),
        },
      ],
    },
  ],
};

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

const useCoefficientToCreateSlots = (timeRanges: TimeRangeTypeJson[], k: K) => {
  const bucket: any[] = [];
  return function closurfFn() {
    timeRanges.forEach((timeRange) => {
      if (bucket.length === 0) {
        bucket.push({
          start: DateTime.fromISO(timeRange.start).toISO(),
          end: DateTime.fromISO(timeRange.start).plus(k).toISO(),
        });
      }

      while (
        // fine del range e' maggiore della fine del bukcet && fine del range - la fine del bucket e' >= al coefficiente
        timeRange.end > bucket[bucket.length - 1].end &&
        DateTime.fromISO(timeRange.end).diff(
          DateTime.fromISO(bucket[bucket.length - 1].end),
          ['hours', 'minutes']
        ).values.hours >= k.hours
      ) {
        bucket.push({
          start: bucket[bucket.length - 1].end,
          end: DateTime.fromISO(bucket[bucket.length - 1].end)
            .plus(k)
            .toISO(),
        });
      }
    });
    return bucket;
  };
};

const getGeneralAvaliabilityInSlots = (
  myGeneralRules: GeneralAvaliabilityRulesType
): {
  day: string;
  availability: TimeRangeTypeJson[];
}[] => {
  return myGeneralRules.generalAvaliabilityRules.map((slot) => {
    const getAvailabilityInSlots = useCoefficientToCreateSlots(
      slot.availability,
      COEFFICIENT
    );
    return {
      day: slot.day,
      availability: getAvailabilityInSlots(),
    };
  });
};

var minutesOfDay = function (m: any) {
  console.log(m.minutes, 'minutes');
  console.log(m.hours, 'hours');
  return m.minutes + m.hours * 60;
};

const useCoefficientToCreateSlots2 = (
  timeRanges: TimeRangeTypeJson[],
  k: K,
  kBreaks: {
    before: { hours: number; minutes: number };
    after: { hours: number; minutes: number };
  }
) => {
  const bucket: any[] = [];
  return function closurfFn() {
    timeRanges.forEach((timeRange) => {
      if (bucket.length === 0) {
        bucket.push({
          start: DateTime.fromISO(timeRange.start).toUTC().toISO(),
          end: DateTime.fromISO(timeRange.start).plus(k).toUTC().toISO(),
        });
      }

      while (
        DateTime.fromISO(timeRange.end) >
          DateTime.fromISO(bucket[bucket.length - 1].end).plus(kBreaks.after) &&
        minutesOfDay(
          DateTime.fromISO(timeRange.end)
            .minus(kBreaks.before)
            .diff(DateTime.fromISO(bucket[bucket.length - 1].end), [
              'hours',
              'minutes',
            ]).values
        ) >= minutesOfDay(k)
      ) {
        if (
          minutesOfDay(
            DateTime.fromISO(timeRange.start).diff(
              DateTime.fromISO(bucket[bucket.length - 1].end),
              ['hours', 'minutes']
            ).values
          ) >= minutesOfDay(k)
        ) {
          console.log('here');
          bucket.push({
            start: DateTime.fromISO(timeRange.start).toUTC().toISO(),
            end: DateTime.fromISO(timeRange.start).plus(k).toUTC().toISO(),
          });
        }
        bucket.push({
          start: bucket[bucket.length - 1].end,
          end: DateTime.fromISO(bucket[bucket.length - 1].end)
            .plus(k)
            .toUTC()
            .toISO(),
        });
      }
    });
    return bucket;
  };
};

const compareTwoDatesWithK = (
  range: TimeRangeTypeJson,
  av: TimeRangeTypeJson,
  k: K
) => {
  const kBreaks = {
    before: { hours: 0, minutes: 45 },
    after: { hours: 0, minutes: 45 },
  };

  // fine del range e' maggiore della fine del bukcet && fine del range - la fine del bucket e' >= al coefficiente

  return (
    // DateTime.fromISO(range.end) >
    //   DateTime.fromISO(av.end).plus(kBreaks.after) &&
    minutesOfDay(
      DateTime.fromISO(range.end).diff(
        DateTime.fromISO(av.end).plus(kBreaks.after),
        ['hours', 'minutes']
      ).values
    ) >= minutesOfDay(k)
  );
};

// console.log(
//   useCoefficientToCreateSlots2(
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
//     { hours: 0, minutes: 45 },
//     { before: { hours: 0, minutes: 45 }, after: { hours: 1, minutes: 0 } }
//   )()
// );

console.log(
  compareTwoDatesWithK(
    {
      start: '2021-10-04T09:30:00.000Z',
      end: '2021-10-04T20:15:00.000Z',
    },
    {
      start: '2021-10-04T07:30:00.000Z',
      end: '2021-10-04T19:30:00.000Z',
    },

    { hours: 0, minutes: 0 }
  )
);
