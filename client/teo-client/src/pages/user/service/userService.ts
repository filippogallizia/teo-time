import axios from 'axios';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
import { ENDPOINT } from '../../../api';

export const retriveUserBooking = async (fn: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${ENDPOINT}/userBookings`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });

    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const deleteBooking = async (
  fn: any,
  body: { start: string; end: string }
) => {
  const { start, end } = body;
  try {
    const response = await axios({
      method: 'post',
      url: `${ENDPOINT}/deleteBooking`,
      data: {
        start,
        end,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });

    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
