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
  BIG_MARGIN_BOTTOM,
} from '../constant';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../pages/booking/bookingReducer';

const EventInformations = ({ state, dispatch }: BookingComponentType) => {
  return (
    <div
      className={`${GLOBAL_PADDING} grid col-1 gap-4 justify-items-center relative md:static ${BIG_MARGIN_BOTTOM}`}
    >
      <div className={`${MARGIN_BOTTOM}`}>
        {(state.schedules.isConfirmPhase ||
          state.schedules.isRenderAvailabilities) && (
          <div className={`absolute top-3 left-3 ${MARGIN_BOTTOM}  md:static`}>
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
      <div className="grid col-1 gap-3 justify-items-center">
        <p className={`${PARAGRAPH_MEDIUM} md:${PARAGRAPH_BIG}`}>Matteo</p>
        <p className={`${BOLD}  ${PARAGRAPH_MEDIUM} md:${PARAGRAPH_BIG}`}>
          TRAINING
        </p>
        <div className={`flex align-middle`}>
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
