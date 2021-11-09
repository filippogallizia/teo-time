import axios from 'axios';
import { ACCESS_TOKEN } from '../../../../../shared/locales/constant';
import { DayAvalSettingsType } from '../../../../booking/stateReducer';

const URL = 'http://0.0.0.0:5000';

export const manageAvailabilities = async (
  fn: any,
  body: DayAvalSettingsType[]
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${URL}/manageAvailabilities`,
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
