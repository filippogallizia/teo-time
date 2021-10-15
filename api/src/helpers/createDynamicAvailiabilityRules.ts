const { DateTime } = require('luxon');

const myGeneralRules: GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: [
    {
      day: 'Monday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000'),
          end: DateTime.fromISO('2021-10-05T21:00:00.000'),
        },
      ],
    },
    {
      day: 'Tuesday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000'),
          end: DateTime.fromISO('2021-10-05T21:00:00.000'),
        },
      ],
    },
    {
      day: 'Wednesday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000'),
          end: DateTime.fromISO('2021-10-05T21:00:00.000'),
        },
      ],
    },
    {
      day: 'Thursday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000'),
          end: DateTime.fromISO('2021-10-05T21:00:00.000'),
        },
      ],
    },
    {
      day: 'Friday',

      availability: [
        {
          start: DateTime.fromISO('2021-10-05T07:00:00.000'),
          end: DateTime.fromISO('2021-10-05T21:00:00.000'),
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
          start: timeRange.start,
          end: timeRange.start.plus(k),
        });
      }
      while (
        timeRange.end > bucket[bucket.length - 1].end &&
        timeRange.end.diff(bucket[bucket.length - 1].end, ['hours', 'minutes'])
          .values.hours >= k.hours
      ) {
        bucket.push({
          start: bucket[bucket.length - 1].end,
          end: bucket[bucket.length - 1].end.plus(k),
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
