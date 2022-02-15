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
  start?: string;
  end?: string;
  isHoliday?: boolean;
  localId?: number;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
};

class AdminPageApi {
  public getUsersAndBookings(
    criteria?: Criteria,
    page?: number,
    size?: number
  ): Promise<any> {
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
}

export default new AdminPageApi();
