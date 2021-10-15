import React, { Dispatch, SetStateAction, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarComponentType = {
  setIsBookSlotView?: Dispatch<SetStateAction<boolean>>;
};

function CalendarComponent({ setIsBookSlotView }: CalendarComponentType) {
  const [value, onChange] = useState(new Date());

  return (
    <Calendar
      onClickDay={() => {
        setIsBookSlotView && setIsBookSlotView(true);
      }}
      onChange={onChange}
      value={value}
    />
  );
}
export default CalendarComponent;
