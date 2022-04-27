import { useContext } from 'react';
import { BookingContext } from './BookingContext';

export const useBookingContext = () => useContext(BookingContext);
