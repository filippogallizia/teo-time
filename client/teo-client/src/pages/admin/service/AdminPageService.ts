import axios from 'axios';
import { BookingType } from '../../../../types/Types';
import { ACCESS_TOKEN } from '../../../shared/locales/constant';
import { ENDPOINT } from '../../../api';

export const getUsersAndBookings = async (fn: any) => {
  let config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
    },
  };
  try {
    const response = await axios.get(`${ENDPOINT}/usersAndBookings`, config);
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
    const response = await axios.get(`${ENDPOINT}/allUsers`, config);
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
    const response = await axios.get(`${ENDPOINT}/getHolidays`, config);
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
