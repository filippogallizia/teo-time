import axios from 'axios';
import { ACCESS_TOKEN } from '../../../../../shared/locales/constant';
import { DayAvalSettingsType } from '../../../../booking/stateReducer';

import { ENDPOINT } from '../../../../../api';

export const manageAvailabilities = async (
  fn: any,
  body: DayAvalSettingsType[]
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${ENDPOINT}/manageAvailabilities`,
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

export const getGeneralWorkingHrs = async (fn: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${ENDPOINT}/workingHours`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};
