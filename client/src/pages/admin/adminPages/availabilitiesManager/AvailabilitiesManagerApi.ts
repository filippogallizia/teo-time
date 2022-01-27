import { DayAvalSettingsType } from '../../../booking/stateReducer';

import HttpService from '../../../../services/HttpService';

// TO IMPLEMENT THE CLASS
class AvailManagerApi {
  public createDefaultAvail(body: DayAvalSettingsType[]): Promise<any> {
    return HttpService.put(`/defaultAvailabilities`, {
      workSettings: body,
    });
  }

  public getDefaultAvail(): Promise<any> {
    return HttpService.get(`/defaultAvailabilities`);
  }
}

export default new AvailManagerApi();
