import axios from 'axios';
import { BookingType } from '../../../types/Types';
import { ACCESS_TOKEN } from '../../shared/locales/constant';
import { ENDPOINT } from '../../api';
import HttpService from '../../services/HttpService';

export type BookingAndUsersResponse = {
  id: number;
  start: string;
  end: string;
  isHoliday: boolean;
  localId: number;
  user?: any;
  userId: number;
};

export type GetHolidayResponseType = BookingType[];

class AdminPageApi {
  public getUsersAndBookings(): Promise<any> {
    return HttpService.get(`/usersAndBookings`);
  }

  public getAllUsers(): Promise<any> {
    return HttpService.get(`/allUsers`);
  }

  public getHolidays(): Promise<any> {
    return HttpService.get(`/getHolidays`);
  }
}

export default new AdminPageApi();

//export const getUsersAndBookings = async (fn: any) => {
//  let config = {
//    headers: {
//      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
//    },
//  };
//  try {
//    const response = await axios.get(`${ENDPOINT}/usersAndBookings`, config);
//    fn(response.data);
//  } catch (e: any) {
//    throw e;
//  }
//};

//export const getAllUsers = async (fn: any) => {
//  let config = {
//    headers: {
//      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
//    },
//  };
//  try {
//    const response = await axios.get(`${ENDPOINT}/allUsers`, config);
//    fn(response.data);
//  } catch (e: any) {
//    throw e;
//  }
//};

//export const getHolidays = async (fn: any) => {
//  let config = {
//    headers: {
//      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
//    },
//  };
//  try {
//    const response = await axios.get(`${ENDPOINT}/getHolidays`, config);
//    fn(response.data);
//  } catch (e: any) {
//    throw e;
//  }
//};
