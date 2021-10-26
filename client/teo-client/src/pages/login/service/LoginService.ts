import axios from 'axios';
const URL = 'http://0.0.0.0:5000';

export const checkForOtp = async (fn: any, OTP: string | null) => {
  try {
    const response = await axios.get(`${URL}/?otp=${OTP}`);
    fn(response.data);
  } catch (e) {
    throw e;
  }
};

export const signup = async (
  fn: any,
  body: { email: string; phoneNumber: number; name: string }
) => {
  try {
    const { email, phoneNumber, name } = body;
    const response = await axios.post(`${URL}/signup`, {
      email,
      phoneNumber,
      name,
    });
    fn(response.data);
  } catch (e) {
    throw e;
  }
};
