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
