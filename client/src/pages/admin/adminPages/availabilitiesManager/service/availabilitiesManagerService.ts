import axios from 'axios';
import { ACCESS_TOKEN } from '../../../../../shared/locales/constant';
import { DayAvalSettingsType } from '../../../../booking/stateReducer';

import { ENDPOINT } from '../../../../../api';

// TO IMPLEMENT THE CLASS
//class AvailManagerApi {
//  public createDefaultAvail(body: DayAvalSettingsType[]): Promise<any> {
//    return HttpService.put(`${ENDPOINT}/defaultAvailabilities`, {
//      workSettings: body,
//    });
//  }

//  public getDefaultAvail(): Promise<any> {
//    return HttpService.get(`${ENDPOINT}/defaultAvailabilities`);
//  }
//}

export const createDefaultAvail = async (
  fn: any,
  body: DayAvalSettingsType[]
) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${ENDPOINT}/defaultAvailabilities`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
      data: {
        workSettings: body,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

export const getDefaultAvail = async (fn: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${ENDPOINT}/defaultAvailabilities`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

//export default new AvailManagerApi();
