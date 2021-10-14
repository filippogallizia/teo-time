import React, { Dispatch, SetStateAction, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarComponentType = {
  setIsBookSlotView: Dispatch<SetStateAction<boolean>>;
};

function CalendarComponent({ setIsBookSlotView }: CalendarComponentType) {
  const [value, onChange] = useState(new Date());
  return (
    <div className="flex justify-center">
      <div style={{ maxWidth: '600px' }}>
        <Calendar
          onClickDay={() => setIsBookSlotView(true)}
          onChange={onChange}
          value={value}
        />
        <pre>{JSON.stringify(value)}</pre>
      </div>
    </div>
  );
}

export default CalendarComponent;
