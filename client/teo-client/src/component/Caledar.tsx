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
    return dispatch({ type: SET_SELECTION_DATE, payload: value });
  };
  return (
    <Calendar
      minDate={new Date()}
      onClickDay={() => {
        setRenderAvailabilities && setRenderAvailabilities(true);
      }}
      onChange={myDispatch}
      value={state.schedules.selectedDate}
    />
  );
}
export default CalendarComponent;
