export type DatabaseAvailabilityType = {
  id?: number;
  day: string;
  workTimeStart: string;
  workTimeEnd: string;
  breakTimeStart: string;
  breakTimeEnd: string;
  eventDurationHours: number;
  eventDurationMinutes: number;
  breakTimeBtwEventsHours: number;
  breakTimeBtwEventsMinutes: number;
};

export type TimeRangeType = {
  start: string;
  end: string;
};

export type HrsAndMinsType = { hours: number; minutes: number };

export type DayAvailabilityType = {
  day: string;
  availability: TimeRangeType[];
};

export type GeneralAvaliabilityRulesType = {
  weekAvalSettings: DayAvailabilityType[];
};

export type BookedHoursType = {
  bookings: TimeRangeType[];
};

export type BookingType = {
  id: number;
  start: string;
  end: string;
  userId: number;
};

export type UserType = {
  id?: number;
  password?: any;
  email?: string;
  name?: string;
  phoneNumber?: number;
  role?: string;
};
