import axios from 'axios';
import { ENDPOINT } from '../../../../api';
import { ACCESS_TOKEN } from '../../../../shared/locales/constant';

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

//export const getGeneralWorkingHrs = async (fn: any) => {
//  try {
//    const response = await axios({
//      method: 'get',
//      url: `${ENDPOINT}/workingHours`,
//      headers: {
//        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
//      },
//    });
//    fn(response.data);
//  } catch (e) {
//    throw e;
//  }
//};
