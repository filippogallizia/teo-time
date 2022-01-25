import axios from 'axios';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
import { ENDPOINT } from '../../../api';
import HttpService from '../../../services/HttpService';

class UserPageApi {
  public retriveUserBooking(): Promise<any> {
    return HttpService.get(`/userBookings`);
  }

  public deleteBooking(body: { start: string; end: string }): Promise<any> {
    const { start, end } = body;
    return HttpService.post(`/deleteBooking`, {
      start,
      end,
    });
  }
}

export default new UserPageApi();
