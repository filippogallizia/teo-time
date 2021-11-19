import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { GrLocationPin } from 'react-icons/gr';
import {
  EVENT_INFO_TEXT,
  MARGIN_BOTTOM,
  TITLE,
} from '../shared/locales/constant';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAL,
} from '../pages/booking/stateReducer';
import i18n from '../i18n';

const EventInformations = ({ state, dispatch }: BookingComponentType) => {
  return (
    <div
      className={`grid col-1  justify-items-center relative md:static ${MARGIN_BOTTOM}`}
    >
      {(state.schedules.isConfirmPhase || state.schedules.isRenderAval) && (
        <div className={`absolute top-1 left-2 md:static md:hidden`}>
          <BsFillArrowLeftSquareFill
            onClick={() => {
              dispatch({ type: SET_CONFIRM_PHASE, payload: false });
              dispatch({ type: SET_RENDER_AVAL, payload: false });
            }}
            size="1.5em"
            color="#f59e0b"
          />
        </div>
      )}

      <div className="grid col-1 gap-4 justify-items-center">
        {/* <p className={`${BOLD}  ${PARAGRAPH_MEDIUM} md:${PARAGRAPH_BIG}`}> */}
        <p className={`${TITLE}`}>
          {i18n.t('eventInformationComponent.eventType', {
            catergory: 'Trattamento osteopatico',
          })}
        </p>
        <div className={`flex align-middle`}>
          <BiTime size="1.2em" color="black" />
          <p className={EVENT_INFO_TEXT}>
            {i18n.t('eventInformationComponent.eventTime', { duration: '1h' })}
          </p>
        </div>
        <div className="flex align-middle">
          <GrLocationPin size="1.2em" color="black" />
          <div>
            <p className={EVENT_INFO_TEXT}>
              {i18n.t('eventInformationComponent.eventLocation', {
                location: 'Milano - via Osti',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInformations;
