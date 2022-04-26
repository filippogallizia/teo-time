import { DateSchema } from 'yup';
import { BookingType } from '../../../../../types/Types';
import HttpService from '../../../../services/HttpService';

export type BookingAndUsersResponse = {
  id: number;
  start: string;
  end: string;
  isHoliday: boolean;
  localId: number;
  user?: any;
  userId: number;
};

export type GetHolidayResponseType = BookingType[];

type Criteria = {
  id?: number;
  isHoliday?: boolean;
  localId?: number;
  userId?: number;
  start?: string;
  end?: string;
};

class AdminPageApi {
  public getUsersAndBookings(
    criteria?: Criteria,
    page?: number,
    size?: number
  ): Promise<BookingAndUsersResponse[]> {
    return HttpService.get(`/bookings/users`, {
      page,
      size,
      ...criteria,
    });
  }

  public getAllUsers(): Promise<any> {
    return HttpService.get(`/users`);
  }

  public getHolidays(): Promise<any> {
    return HttpService.get(`/holidays`);
  }

  public deleteBooking(body: { start: string; end: string }): Promise<any> {
    const { start, end } = body;
    return HttpService.delete(`/bookings`, {
      data: {
        start,
        end,
      },
    });
  }
}

export default new AdminPageApi();
