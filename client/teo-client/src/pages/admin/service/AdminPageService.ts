import axios from 'axios';
import { WEB_TOKEN } from '../../../shared/locales/constant';
const URL = 'http://0.0.0.0:5000';

export const getUsersAndBookings = async (fn: any) => {
  let config = {
    headers: {
      Authorization: `Bearer ${WEB_TOKEN}`,
    },
  };
  try {
    const response = await axios.get(`${URL}/usersAndBookings`, config);
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const getAllUsers = async (fn: any) => {
  let config = {
    headers: {
      Authorization: `Bearer ${WEB_TOKEN}`,
    },
  };
  try {
    const response = await axios.get(`${URL}/allUsers`, config);
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
