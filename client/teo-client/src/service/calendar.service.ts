import axios from 'axios';

const URL = 'http://0.0.0.0:5000';

export const getAvailabilities = async (fn: any) => {
  try {
    const response = await axios.post(`${URL}/retrieveAvailability`, {
      start: '2021-10-05T07:00:00.000',
      end: '2021-10-05T09:30:00.000',
    });
    fn(response.data);
  } catch (e) {
    console.log(e);
  }
};

export const createBooking = async (
  fn: any,
  body: { start: string; end: string }
) => {
  try {
    const { start, end } = body;
    const response = await axios.post(`${URL}/createbooking`, {
      start,
      end,
    });
    fn(response.data);
  } catch (e) {
    console.log(e);
  }
};
