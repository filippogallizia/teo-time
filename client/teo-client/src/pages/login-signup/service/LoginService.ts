import axios from 'axios';
const URL = 'http://0.0.0.0:5000';

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
