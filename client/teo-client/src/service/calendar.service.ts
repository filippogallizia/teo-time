import axios from 'axios';

const URL = 'http://0.0.0.0:5000';

export const getBooking = async (fn: any) => {
  try {
    const response = await axios.post(`${URL}/retrievebooking`, {
      start: '2021-10-05T07:00:00.000',
      end: '2021-10-05T09:30:00.000',
    });
    fn(response.data);
  } catch (e) {
    console.log(e);
  }
};
