import axios from 'axios';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
const URL = 'http://0.0.0.0:5000';
const webtoken = localStorage.getItem(ACCESS_TOKEN);

export const signupService = async (
  fn: any,
  body: { email: string; name: string; password: any; phoneNumber: number }
) => {
  try {
    const { email, name, password, phoneNumber } = body;
    const response = await axios.post(`${URL}/signup`, {
      email,
      name,
      password,
      phoneNumber,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const loginService = async (
  fn: any,
  body: { email: string; password: any }
) => {
  try {
    const { email, password } = body;
    const response = await axios.post(`${URL}/login`, {
      email,
      password,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const resetPassword = async (fn: any, body: { email: string }) => {
  const { email } = body;
  try {
    const response = await axios.post(`${URL}/resetPassword`, {
      email,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const postOtpForVerification = async (
  fn: any,
  body: { resetPasswordToken: string }
) => {
  try {
    const { resetPasswordToken } = body;
    const response = await axios.post(`${URL}/password/otp`, {
      resetPasswordToken,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const postNewPassword = async (
  fn: any,
  body: { resetPasswordToken: string | null; newPassword: string }
) => {
  try {
    const { resetPasswordToken, newPassword } = body;
    const response = await axios.post(`${URL}/password/otp`, {
      resetPasswordToken,
      newPassword,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
