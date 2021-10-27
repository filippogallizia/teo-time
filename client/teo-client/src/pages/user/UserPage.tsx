import React, { useEffect, useState } from 'react';
import EventListener from '../../helpers/EventListener';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { retriveUserBooking } from './service/userService';

const UserPage = ({ dispatch, state }: BookingComponentType) => {
  const [userBooking, setBooking] = useState([]);
  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const password = localStorage.getItem('token');
        if (password) {
          await retriveUserBooking(setBooking, { password: Number(password) });
        }
      } catch (e: any) {
        EventListener.emit('errorHandling', e.response);
      }
    };
    asyncFunc();
  });
  return <div>i miei dati</div>;
};

export default UserPage;
