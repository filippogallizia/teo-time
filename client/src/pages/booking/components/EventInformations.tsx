import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { GrLocationPin } from 'react-icons/gr';
import { BiEuro } from 'react-icons/bi';
import { BookingComponentType } from '../BookingPageTypes';
import { SET_CONFIRM_PHASE, SET_RENDER_AVAL } from '../stateReducer';
import { EVENT_INFO_TEXT, TITLE } from '../../../shared/locales/constant';
import i18n from '../../../i18n';

const EventInformations = ({ state, dispatch }: BookingComponentType) => {
  return (
    <div className={`grid col-1 gap-4  justify-items-center  md:static `}>
      {(state.schedules.isConfirmPhase || state.schedules.isRenderAval) && (
        <div className={`justify-self-start md:static md:hidden`}>
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
        <p className={`${TITLE} text-center`}>
          {i18n.t('eventInformationComponent.eventType', {
            catergory: 'Trattamento osteopatico',
          })}
        </p>

        <div className={`flex items-center`}>
          <BiTime size="1em" color="black" />
          <p className={EVENT_INFO_TEXT}>
            {i18n.t('eventInformationComponent.eventTime', { duration: '1h' })}
          </p>
        </div>
        <div className="flex items-center">
          <GrLocationPin size="1em" color="black" />
          <div>
            <p className={EVENT_INFO_TEXT}>
              {i18n.t('eventInformationComponent.eventLocation', {
                location: 'Milano - via Osti',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <BiEuro size="1em" color="black" />
          <div>
            <p className={EVENT_INFO_TEXT}>50</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInformations;
