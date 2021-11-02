import axios from 'axios';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
// import { WEB_TOKEN } from '../../../constant';
const URL = 'http://0.0.0.0:5000';
const webtoken = localStorage.getItem(ACCESS_TOKEN);

export const retriveUserBooking = async (fn: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${URL}/bookingFromUser`,
      headers: {
        Authorization: `Bearer ${webtoken}`,
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
      url: `${URL}/deletebooking`,
      data: {
        start,
        end,
      },
      headers: {
        Authorization: `Bearer ${webtoken}`,
      },
    });

    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
