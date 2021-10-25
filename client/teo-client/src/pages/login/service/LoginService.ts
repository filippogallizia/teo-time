import axios from 'axios';
const URL = 'http://0.0.0.0:5000';

export const checkForOtp = async (fn: any, OTP: string | null) => {
  try {
    const response = await axios.get(`${URL}/?otp=${OTP}`);
    fn(response.data);
  } catch (e) {
    console.log(e);
  }
};

export const signup = async (fn: any, email: string) => {
  try {
    const response = await axios.post(`${URL}/signup`, {
      email,
    });
    fn(response.data);
  } catch (e) {
    console.log(e);
  }
};
