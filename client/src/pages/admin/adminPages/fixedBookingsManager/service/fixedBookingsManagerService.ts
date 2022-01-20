import axios from 'axios';
import { ACCESS_TOKEN } from '../../../../../shared/locales/constant';
import { DayAvalSettingsType } from '../../../../booking/stateReducer';

import { ENDPOINT } from '../../../../../api';

export const createFixedBookings = async (
  fn: any,
  body: DayAvalSettingsType[]
) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${ENDPOINT}/fixedBookings`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
      data: {
        fixedBks: body,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

export const getFixedBookings = async (fn: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${ENDPOINT}/fixedBookings`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};
