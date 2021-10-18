import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CalendarComponentType } from '../pages/booking/BookingPageTypes';
import '../pages/booking/calendarCustomStyle.css';

function CalendarComponent({
  setRenderAvailabilities,
  setSelectionDate,
  selectedDate,
}: CalendarComponentType) {
  return (
    <Calendar
      onClickDay={() => {
        setRenderAvailabilities && setRenderAvailabilities(true);
      }}
      onChange={setSelectionDate}
      value={selectedDate}
    />
  );
}
export default CalendarComponent;
