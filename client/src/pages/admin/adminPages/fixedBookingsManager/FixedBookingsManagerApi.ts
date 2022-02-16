import HttpService from '../../../../services/HttpService';
import { BookingDetailsType } from './reducer';

export type FixedBookingDTO = {
  day: string;
  email: string;
  end: string;
  id: number;
  start: string;
  exceptionDate: string;
};

class FixedBookingsManagerApi {
  public createFixedBookings(body: BookingDetailsType): Promise<any> {
    return HttpService.post(`/fixedBookings`, {
      fixedBks: body,
    });
  }

  public getFixedBookings(
    criteria?: Partial<FixedBookingDTO>
  ): Promise<FixedBookingDTO[]> {
    return HttpService.get(`/fixedBookings`);
  }

  public updateFixedBookings(body: BookingDetailsType): Promise<any> {
    return HttpService.put(`/fixedBookings`, {
      fixedBks: body,
    });
  }

  public deleteFixedBooking(id: number): Promise<any> {
    return HttpService.delete(`/fixedBookings?id=${id}`);
  }
}

export default new FixedBookingsManagerApi();
