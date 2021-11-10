import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useHistory } from 'react-router';
import { FLEX_DIR_ROW } from '../shared/locales/constant';
import {
  Actions,
  InitialState,
  SET_SELECTION_HOUR,
} from '../pages/booking/stateReducer';
import routes from '../routes';

type AvalChildType = {
  hour: { start: string; end: string };
  id: number;
  setIsClicked: Dispatch<SetStateAction<{ id: number; isOpen: boolean }>>;
  isClicked: { id: number; isOpen: boolean };
  dispatch: Dispatch<Actions>;
  state: InitialState;
};

function AvailabilityHourContainer({
  hour,
  id,
  isClicked,
  setIsClicked,
  dispatch,
  state,
}: AvalChildType) {
  useEffect(() => {}, [state.schedules.selectedHour]);
  const history = useHistory();

  return (
    <div className={`${FLEX_DIR_ROW} w-11/12`}>
      {isClicked.isOpen && isClicked.id === id ? (
        <div className={`${FLEX_DIR_ROW} w-11/12`}>
          <div
            className={`${FLEX_DIR_ROW} text-white border-2 border-gray-500 bg-gray-300  mr-1 p-4 w-full md:p-4`}
          >
            {`${hour.start}`}
          </div>
          <div
            onClick={() => {
              dispatch({ type: SET_SELECTION_HOUR, payload: hour.start });
              history.push(routes.CONFIRM_PAGE);
            }}
            className={`${FLEX_DIR_ROW} text-white border-2 border-yellow-500  bg-yellow-500 hover:bg-yellow-700 cursor-pointer  ml-1  p-4 w-full md:p-4`}
          >
            confirm
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsClicked({ id: id, isOpen: true });
          }}
          className="flex flex-col justify-center items-center border-2 border-yellow-500 hover:border-yellow-700 cursor-pointer m-2 p-4 w-11/12 md:p-4 md:w-4/5"
        >
          {`${hour.start} - ${hour.end}`}
        </div>
      )}
    </div>
  );
}

export default AvailabilityHourContainer;
