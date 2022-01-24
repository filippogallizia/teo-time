export type TimeRangeType = {
  start: string;
  end: string;
};

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

export type BookingAndUser = {
  id: number;
  start: string;
  end: string;
  userId: number;
  user: UserType;
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
  resetPasswordToken?: string;
};

export type TokenType = string;
