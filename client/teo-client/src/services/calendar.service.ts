import axios from 'axios';
import { ACCESS_TOKEN } from '../shared/locales/constant';

const URL = 'http://0.0.0.0:5000';

const webtoken = localStorage.getItem(ACCESS_TOKEN);

console.log(webtoken, 'webtoken');

export const getAvailabilities = async (
  fn: any,
  body: { start: string; end: string }
) => {
  const { start, end } = body;
  const bodyToSend = { timeRange: [{ start, end }] };
  let config = {
    headers: {
      Authorization: `Bearer ${webtoken}`,
    },
  };

  try {
    const response = await axios.post(
      `${URL}/retrieveAvailability`,
      bodyToSend,
      config
    );
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
  let config = {
    headers: {
      Authorization: `Bearer ${webtoken}`,
    },
  };
  try {
    const { start, end, email } = body;
    const response = await axios.post(
      `${URL}/createbooking`,
      {
        start,
        end,
        email,
      },
      config
    );
    fn(response.data);
  } catch (e) {
    throw e;
  }
};
