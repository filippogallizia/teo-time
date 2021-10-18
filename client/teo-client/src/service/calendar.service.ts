import axios from 'axios';

const URL = 'http://0.0.0.0:5000';

export const getAvailabilities = async (
  fn: any,
  body: { start: string; end: string }
) => {
  const { start, end } = body;
  try {
    const response = await axios.post(`${URL}/retrieveAvailability`, {
      start,
      end,
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
