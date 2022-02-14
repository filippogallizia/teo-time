import { DateTime } from 'luxon';
import { FixedBookingDTO } from '../../fixedBookingsManager/FixedBookingsManagerApi';

export const mapFixedBookings = (response: FixedBookingDTO[]) => {
  return response.map((book: FixedBookingDTO) => {
    const [hoursStart, minutesStart] = book.start.split(':');
    const [hoursEnd, minutesEnd] = book.end.split(':');

    const startDate = new Date();
    startDate.setHours(Number(hoursStart));
    startDate.setMinutes(Number(minutesStart));

    const endDate = new Date();
    endDate.setHours(Number(hoursEnd));
    endDate.setMinutes(Number(minutesEnd));

    return {
      ...book,
      start: DateTime.fromJSDate(startDate).toUTC().toString(),
      end: DateTime.fromJSDate(endDate).toUTC().toString(),
    };
  });
};
