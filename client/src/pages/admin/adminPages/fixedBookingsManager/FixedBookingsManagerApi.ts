import { DayAvalSettingsType } from '../../../booking/stateReducer';

import HttpService from '../../../../services/HttpService';

class FixedBookingsManagerApi {
  public createFixedBookings(body: DayAvalSettingsType[]): Promise<any> {
    return HttpService.post(`/fixedBookings`, {
      fixedBks: body,
    });
  }

  public getFixedBookings(): Promise<any> {
    return HttpService.get(`/fixedBookings`);
  }
}

export default new FixedBookingsManagerApi();
