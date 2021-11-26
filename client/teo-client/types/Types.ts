export type TimeRangeType = {
  start: string;
  end: string;
};

export type GeneralAvailabilityType = {
  day: string;
  availability: TimeRangeType[];
};

export type GeneralAvaliabilityRulesType = {
  weekAvalSettings: GeneralAvailabilityType[];
};

export type BookedHoursType = {
  bookings: TimeRangeType[];
};

export type HrsAndMinsType = { hours: number; minutes: number };

export type BookingType = {
  id: number;
  start: string;
  end: string;
  userId: number;
  isHoliday: boolean;
  localId?: number;
};

export type UserType = {
  id?: number;
  password?: any;
  email?: string;
  name?: string;
  phoneNumber?: number;
  role?: string;
};
