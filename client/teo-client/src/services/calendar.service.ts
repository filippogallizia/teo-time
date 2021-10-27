import axios from 'axios';

const URL = 'http://0.0.0.0:5000';

export const getAvailabilities = async (
  fn: any,
  body: { start: string; end: string }
) => {
  const { start, end } = body;
  const bodyToSend = { timeRange: [{ start, end }] };
  try {
    const response = await axios.post(
      `${URL}/retrieveAvailability`,
      bodyToSend
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
  try {
    const { start, end, email } = body;
    const response = await axios.post(`${URL}/createbooking`, {
      start,
      end,
      email,
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};
