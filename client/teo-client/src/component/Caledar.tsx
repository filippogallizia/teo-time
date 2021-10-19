import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarComponentType } from '../pages/booking/BookingPageTypes';
import { SET_SELECTION_DATE } from '../pages/booking/bookingReducer';
import '../pages/booking/calendarCustomStyle.css';

function CalendarComponent({
  setRenderAvailabilities,
  dispatch,
  state,
}: CalendarComponentType) {
  const myDispatch = (value: any) => {
    const myPromise = new Promise((resolve, reject) => {
      //@ts-expect-error
      resolve();
    });
    myPromise
      .then(() => {
        dispatch({ type: SET_SELECTION_DATE, payload: value });
      })
      .then(() => {
        setRenderAvailabilities && setRenderAvailabilities(true);
      });
  };
  return (
    <Calendar
      minDate={new Date()}
      onChange={myDispatch}
      // onClickDay={() => {
      //   setRenderAvailabilities && setRenderAvailabilities(true);
      // }}
      value={state.schedules.selectedDate}
    />
  );
}
export default CalendarComponent;
