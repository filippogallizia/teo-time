import HttpService from '../../../../services/HttpService';
import { DayAvalSettingsType } from './reducer';

// TO IMPLEMENT THE CLASS
class AvailManagerApi {
  public createDefaultAvail(body: DayAvalSettingsType): Promise<any> {
    return HttpService.put(`/availability/default`, {
      workSettings: body,
    });
  }

  public getDefaultAvail(): Promise<any> {
    return HttpService.get(`/availability/default`);
  }
}

export default new AvailManagerApi();
