import axios from 'axios';
const URL = 'http://0.0.0.0:5000';

export const checkForOtp = async (fn: any, OTP: string | null) => {
  try {
    const response = await axios.get(`${URL}/tokenValidation?otp=${OTP}`);
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

export const retriveUserBooking = async (
  fn: any,
  body: { password: number }
) => {
  try {
    const { password } = body;
    const response = await axios.post(`${URL}/bookingFromUser`, {
      password,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
