import axios from 'axios';
import { ACCESS_TOKEN } from '../shared/locales/constant';

const URL = 'http://0.0.0.0:5000';

export const getAvailabilities = async (
  fn: any,
  body: { start: string; end: string }
) => {
  const { start, end } = body;
  const bodyToSend = { timeRange: [{ start, end }] };

  try {
    const response = await axios({
      method: 'post',
      url: `${URL}/retrieveAvailability`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
      data: {
        ...bodyToSend,
      },
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

export const createBooking = async (
  fn: any,
  body: {
    start: string;
    end: string;
    email: string;
  }
) => {
  try {
    const { start, end, email } = body;
    const response = await axios({
      method: 'post',
      url: `${URL}/createbooking`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
      data: {
        start,
        end,
        email,
      },
    });

    fn(response.data);
  } catch (e) {
    throw e;
  }
};
