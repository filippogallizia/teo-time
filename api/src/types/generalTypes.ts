export type TimeRangeType = {
  start: Date;
  end: Date;
};

export type GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: {
    day: string;
    availability: TimeRangeType[];
  }[];
};

export type BookedHoursType = {
  bookings: TimeRangeType[];
};
