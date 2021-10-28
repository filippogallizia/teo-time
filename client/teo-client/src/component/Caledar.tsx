import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_RENDER_AVAILABILITIES,
  SET_SELECTION_DATE,
} from '../pages/booking/bookingReducer';
import '../pages/booking/calendarCustomStyle.css';

function CalendarComponent({ dispatch, state }: BookingComponentType) {
  const myDispatch = (date: Date) => {
    const myPromise = new Promise((resolve, reject) => {
      //@ts-expect-error
      resolve();
    });
    myPromise
      .then(() => {
        dispatch({ type: SET_SELECTION_DATE, payload: date.toISOString() });
      })
      .then(() => {
        dispatch({ type: SET_RENDER_AVAILABILITIES, payload: true });
        // history.push(routes.CONFIRM_PAGE);
      });
  };
  return (
    <Calendar
      minDate={new Date()}
      onChange={myDispatch}
      value={new Date(state.schedules.selectedDate)}
    />
  );
}
export default CalendarComponent;
