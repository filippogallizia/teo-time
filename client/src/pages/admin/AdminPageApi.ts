import { BookingType } from '../../../types/Types';
import HttpService from '../../services/HttpService';

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

class AdminPageApi {
  public getUsersAndBookings(): Promise<any> {
    return HttpService.get(`/usersAndBookings`);
  }

  public getAllUsers(): Promise<any> {
    return HttpService.get(`/allUsers`);
  }

  public getHolidays(): Promise<any> {
    return HttpService.get(`/getHolidays`);
  }
}

export default new AdminPageApi();
