import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { GrLocationPin } from 'react-icons/gr';
import {
  GLOBAL_PADDING,
  MARGIN_BOTTOM,
  BOLD,
  PARAGRAPH_BIG,
  PARAGRAPH_MEDIUM,
} from '../constant';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../pages/booking/bookingReducer';

const EventInformations = ({ state, dispatch }: BookingComponentType) => {
  return (
    <div
      className={`${GLOBAL_PADDING} pt-0 flex flex-col items-center relative md:static`}
    >
      <div className={`${MARGIN_BOTTOM}`}>
        {(state.schedules.isConfirmPhase ||
          state.schedules.isRenderAvailabilities) && (
          <div
            className={`absolute top-3 left-3 ${MARGIN_BOTTOM} overflow-x-auto md:static`}
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
      <div>
        <p
          className={`${MARGIN_BOTTOM} ${PARAGRAPH_MEDIUM} md:${PARAGRAPH_BIG}`}
        >
          Matteo
        </p>
        <p
          className={`${BOLD} ${MARGIN_BOTTOM} ${PARAGRAPH_MEDIUM} md:${PARAGRAPH_BIG}`}
        >
          TRAINING
        </p>
        <div className={`flex align-middle ${MARGIN_BOTTOM}`}>
          <BiTime size="1.2em" color="black" />
          <p>1h</p>
        </div>
        <div className="flex align-middle">
          <GrLocationPin size="1.2em" color="black" />
          <p>Milano</p>
        </div>
      </div>
    </div>
  );
};

export default EventInformations;

// <div className={`${GLOBAL_PADDING} relative`}>
//   <div className={`${FLEX_DIR_COL} md:flex-none`}>
//     <p className={`${MARGIN_BOTTOM}`}>Matteo</p>
//     <p className={`${BOLD}`}>TRAINING</p>
//   </div>
//   <div className="flex align-middle">
//     <BiTime size="1.2em" color="black" />
//     <p className={`${MARGIN_BOTTOM}`}>1h</p>
//   </div>
//   <div className="flex align-middle">
//     <GrLocationPin size="1.2em" color="black" />
//     <p>Milano</p>
//   </div>
//   <div>
//     {state.schedules.isConfirmPhase && (
//       <div
//         className={`absolute top-4 left-3 ${MARGIN_BOTTOM} md:hidden overflow-x-auto`}
//       >
//         <BsFillArrowLeftSquareFill
//           onClick={() => {
//             dispatch({ type: SET_CONFIRM_PHASE, payload: false });
//             dispatch({ type: SET_RENDER_AVAILABILITIES, payload: false });
//           }}
//           size="1.5em"
//           color="blue"
//         />
//       </div>
//     )}
//   </div>
// </div>
