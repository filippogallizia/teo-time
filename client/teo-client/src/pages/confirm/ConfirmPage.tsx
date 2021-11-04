import { DateTime } from 'luxon';
import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import GeneralButton from '../../component/GeneralButton';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
import EventListener from '../../helpers/EventListener';
import routes from '../../routes';
import { createBooking } from '../../services/calendar.service';
import {
  handleToastInFailRequest,
  parseHoursToObject,
} from '../../shared/locales/utils';
import { BookingComponentType } from '../booking/BookingPageTypes';
import {
  SET_APPOINTMENT_DETAILS,
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../booking/bookingReducer';
import i18n from '../../i18n';
import { toast } from 'react-toastify';

type InitialFormType = {
  name: string;
  email: string;
  phoneNumber: number;
};

const ConfirmPage = ({ dispatch, state }: BookingComponentType) => {
  const history = useHistory();
  const mapped: { hours: number; minutes: number } = parseHoursToObject(
    state.schedules.selectedHour
  );
  const parsedDate = DateTime.fromISO(state.schedules.selectedDate).set({
    hour: 0,
    minute: 0,
    millisecond: 0,
  });
  const myFunc = async (value: InitialFormType) => {
    try {
      const handleSuccess = (response: any) => {
        dispatch({
          type: SET_APPOINTMENT_DETAILS,
          payload: { id: response.id, start: response.start },
        });
      };
      await createBooking(handleSuccess, {
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus({ hours: 1, minutes: 30 }).toISO(),
        email: value.email,
      });
      dispatch({
        type: SET_CONFIRM_PHASE,
        payload: false,
      });
      dispatch({
        type: SET_RENDER_AVAILABILITIES,
        payload: false,
      });
      history.push(routes.HOMEPAGE_SUCCESS);
    } catch (e: any) {
      console.log('here');
      handleToastInFailRequest(e, toast);
    }
  };

  return (
    <div className="grid  grid-cols-1 gap-8 justify-items-center relative">
      <div
        className={`absolute top-0 left-3 md:static`}
        onClick={() => history.push(routes.HOMEPAGE_BOOKING)}
      >
        <BsFillArrowLeftSquareFill
          onClick={() => {
            dispatch({ type: SET_CONFIRM_PHASE, payload: false });
            dispatch({ type: SET_RENDER_AVAILABILITIES, payload: false });
          }}
          size="1.5em"
          color="#f59e0b"
        />
      </div>
      <div className={`${TITLE} ${MARGIN_BOTTOM}`}>
        {i18n.t('confirmPage.confirmDatas')}
      </div>
      <div className={MARGIN_BOTTOM}>
        <div className={TITLE}>
          {i18n.t('confirmPage.date')}
          <span className={`${BOLD} ml-2`}>
            {DateTime.fromISO(state.schedules.selectedDate).toFormat(
              'yyyy LLL  dd - t'
            )}
          </span>
        </div>
      </div>
      <div>
        <GeneralButton
          buttonText={i18n.t('confirmPage.bookButton')}
          onClick={myFunc}
        />
      </div>
    </div>
  );
};

export default ConfirmPage;
