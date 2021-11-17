import axios from 'axios';
import { BookingType } from '../../../../types/Types';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
const URL = 'http://0.0.0.0:5000';

export const getUsersAndBookings = async (fn: any) => {
  let config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
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
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
    },
  };
  try {
    const response = await axios.get(`${URL}/allUsers`, config);
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export type GetHolidayResponseType = BookingType[];

export const getHolidays = async (fn: any) => {
  let config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
    },
  };
  try {
    const response = await axios.get(`${URL}/getHolidays`, config);
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
