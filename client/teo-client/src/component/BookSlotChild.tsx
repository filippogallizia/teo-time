import React, { Dispatch, SetStateAction, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { FLEX_DIR_ROW } from '../constant';

type BookSlotChildType = {
  hours: number;
  id: number;
  setIsClicked: Dispatch<SetStateAction<{ id: number; isOpen: boolean }>>;
  isClicked: { id: number; isOpen: boolean };
};

function BookSlotChild({
  hours,
  id,
  isClicked,
  setIsClicked,
}: BookSlotChildType) {
  console.log(id);
  return (
    <div className={`${FLEX_DIR_ROW} w-11/12`}>
      {isClicked.isOpen && isClicked.id === id ? (
        <div className={`${FLEX_DIR_ROW} w-11/12 md:w-4/5`}>
          <div
            className={`${FLEX_DIR_ROW} text-white border-2 border-gray-500 bg-gray-500  hover:bg-gray-600 mr-1 p-4 w-full md:p-4`}
          >
            {hours}
          </div>
          <div
            className={`${FLEX_DIR_ROW} text-white border-2 border-blue-500  bg-blue-500 ml-1 p-4 w-full md:p-4`}
          >
            confirm
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsClicked({ id: id, isOpen: true })}
          className="flex flex-col justify-center items-center border-2 border-blue-500 hover:border-blue-800  m-2 p-4 w-11/12 md:p-4 md:w-4/5"
        >
          {hours}
        </div>
      )}
    </div>
  );
}

export default BookSlotChild;
