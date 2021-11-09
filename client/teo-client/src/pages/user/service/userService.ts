import axios from 'axios';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
const URL = 'http://0.0.0.0:5000';

export const retriveUserBooking = async (fn: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${URL}/userBookings`,
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
      url: `${URL}/deleteBooking`,
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
