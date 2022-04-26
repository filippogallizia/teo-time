export type BookingDTO = {
  id?: number;
  start: string;
  end: string;
  isHoliday: boolean;
  userId?: number;
  calendarEventId?: string;
};
