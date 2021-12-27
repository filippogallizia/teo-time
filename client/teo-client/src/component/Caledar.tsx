import React from 'react';
import Calendar from 'react-calendar';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_RENDER_AVAL,
  SET_SELECTION_DATE,
} from '../pages/booking/stateReducer';

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
        dispatch({ type: SET_RENDER_AVAL, payload: true });
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
