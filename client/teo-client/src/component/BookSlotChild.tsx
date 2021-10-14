import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

type BookSlotChildType = {
  hours: number;
};

function BookSlotChild({ hours }: BookSlotChildType) {
  const [value, onChange] = useState(new Date());
  console.log(value, 'value');
  return (
    <div
      style={{
        width: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid blue',
        height: '60px',
        marginBottom: '0.5rem',
      }}
    >
      <div>{hours}</div>
    </div>
  );
}

export default BookSlotChild;
