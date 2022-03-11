import { DateTime } from 'luxon';
import React from 'react';
import Calendar from 'react-calendar';
import { BookingComponentType } from '../BookingPageTypes';
import { SET_RENDER_AVAL, SET_SELECTION_DATE } from '../stateReducer';

function CalendarComponent({ dispatch, state }: BookingComponentType) {
  const myDispatch = (date: Date) => {
    //Mon Mar 21 2022
    const myPromise = new Promise((resolve, reject) => {
      //@ts-expect-error
      resolve();
    });
    myPromise
      .then(() => {
        dispatch({
          type: SET_SELECTION_DATE,
          payload: DateTime.fromJSDate(date).toISO(),
        });
      })
      .then(() => {
        dispatch({ type: SET_RENDER_AVAL, payload: true });
      });
  };

  return (
    <Calendar
      minDate={new Date()}
      onChange={myDispatch}
      value={DateTime.fromISO(state.schedules.selectedDate).toJSDate()}
    />
  );
}
export default CalendarComponent;
