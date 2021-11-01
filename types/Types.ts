export type TimeRangeType = {
  start: string;
  end: string;
};

export type GeneralAvailabilityType = {
  day: string;
  availability: TimeRangeType[];
}[];

export type GeneralAvaliabilityRulesType = {
  generalAvaliabilityRules: GeneralAvailabilityType;
};

export type BookedHoursType = {
  bookings: TimeRangeType[];
};

export type timeRange = { start: string; end: string };

export type BookingType = {
  id: number;
  start: string;
  end: string;
  userId: number;
};

export type UserType = {
  id: number;
  password?: any;
  email: string;
  name: string;
  phoneNumber: number;
};
