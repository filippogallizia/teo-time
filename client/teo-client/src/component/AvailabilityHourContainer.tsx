import React, { Dispatch, SetStateAction, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import { FLEX_DIR_ROW } from '../constant';
import { Actions, SET_SELECTION_HOUR } from '../pages/booking/bookingReducer';

type AvailabilitiesChildType = {
  hour: { start: string; end: string };
  id: number;
  setIsClicked: Dispatch<SetStateAction<{ id: number; isOpen: boolean }>>;
  isClicked: { id: number; isOpen: boolean };
  setSelectionHour: Dispatch<SetStateAction<string>>;
  dispatch: Dispatch<Actions>;
};

function AvailabilityHourContainer({
  hour,
  id,
  isClicked,
  setIsClicked,
  setSelectionHour,
  dispatch,
}: AvailabilitiesChildType) {
  // useEffect(() => {
  //   return () => {
  //     return window.removeEventListener('click', () =>
  //       setIsClicked({ id: id, isOpen: false })
  //     );
  //   };
  // }, [id, setIsClicked]);
  return (
    <div className={`${FLEX_DIR_ROW} w-11/12`}>
      {isClicked.isOpen && isClicked.id === id ? (
        <div className={`${FLEX_DIR_ROW} w-11/12`}>
          <div
            className={`${FLEX_DIR_ROW} text-white border-2 border-gray-500 bg-gray-500  mr-1 p-4 w-full md:p-4`}
          >
            {`${hour.start}`}
          </div>
          <div
            onClick={() =>
              dispatch({ type: SET_SELECTION_HOUR, payload: hour.start })
            }
            className={`${FLEX_DIR_ROW} text-white border-2 border-blue-500  bg-blue-500 hover:bg-blue-700 cursor-pointer  ml-1  p-4 w-full md:p-4`}
          >
            confirm
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsClicked({ id: id, isOpen: true });
          }}
          className="flex flex-col justify-center items-center border-2 border-blue-500 hover:border-blue-700 cursor-pointer m-2 p-4 w-11/12 md:p-4 md:w-4/5"
        >
          {`${hour.start}`}
        </div>
      )}
    </div>
  );
}

export default AvailabilityHourContainer;
