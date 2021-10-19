import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { GrLocationPin } from 'react-icons/gr';
import { FLEX_DIR_COL, GLOBAL_PADDING, MARGIN_BOTTOM, BOLD } from '../constant';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../pages/booking/bookingReducer';

const EventInformations = ({ state, dispatch }: BookingComponentType) => {
  console.log(state.schedules.isConfirmPhase, 'state.schedules.isConfirmPhase');
  return (
    <div className={`${GLOBAL_PADDING}  relative`}>
      <div className={`${FLEX_DIR_COL}`}>
        <p className={`${MARGIN_BOTTOM}`}>Matteo</p>
        <p className={`${BOLD}`}>TRAINING</p>
      </div>
      <div className="flex align-middle bg-blue-400">
        <BiTime size="1.2em" color="black" />
        <p className={`${MARGIN_BOTTOM}`}>1h</p>
      </div>
      <div className="flex align-middle">
        <GrLocationPin size="1.2em" color="black" />
        <p>Milano</p>
      </div>
      <div>
        {state.schedules.isConfirmPhase && (
          <div
          // className={`absolute top-4 left-3 ${MARGIN_BOTTOM} md:hidden overflow-x-auto`}
          >
            <BsFillArrowLeftSquareFill
              onClick={() => {
                dispatch({ type: SET_CONFIRM_PHASE, payload: false });
                dispatch({ type: SET_RENDER_AVAILABILITIES, payload: false });
              }}
              size="1.5em"
              color="blue"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventInformations;
