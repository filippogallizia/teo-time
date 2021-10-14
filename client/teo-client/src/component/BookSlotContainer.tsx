import React, { Dispatch, SetStateAction, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookSlotChild from './BookSlotChild';
import GeneralButton from './GeneralButton';

type BookSlotContainerType = {
  setIsBookSlotView: Dispatch<SetStateAction<boolean>>;
};

function BookSlotContainer({ setIsBookSlotView }: BookSlotContainerType) {
  const [value, onChange] = useState(new Date());
  const timeSlots = [9, 10.3, 12];
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <div>
        <div className="flex">
          <div className="mr-2">
            <GeneralButton
              onClick={() => setIsBookSlotView(false)}
              buttonText="back"
            />
          </div>
          <p>wednesday 11/05/2021</p>
        </div>
        <h1>SELECT A TIME</h1>
        <p>Duration 60 min</p>
        {timeSlots.map((slot) => {
          return <BookSlotChild hours={slot} />;
        })}
      </div>
    </div>
  );
}

export default BookSlotContainer;
