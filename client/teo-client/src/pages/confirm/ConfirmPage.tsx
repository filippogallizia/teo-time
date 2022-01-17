import { DateTime } from 'luxon';
import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import GeneralButton from '../../component/GeneralButton';
import { TITLE, USER_INFO } from '../../shared/locales/constant';
import routes from '../../routes';
import { createBooking } from '../../services/calendar.service';
import {
  handleToastInFailRequest,
  parseHoursToObject,
} from '../../shared/locales/utils';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { SET_CONFIRM_PHASE, SET_RENDER_AVAL } from '../booking/stateReducer';
import i18n from '../../i18n';
import { toast } from 'react-toastify';
import InfoBooking from '../admin/components/InfoBooking';
import { HrsAndMinsType } from '../../../types/Types';
import { googleCalendarInsertEvent } from '../login-signup-resetPass/service/LoginService';

type InitialFormType = {
  name: string;
  email: string;
  phoneNumber: number;
};

const EVENT_DURATION = { hours: 1, minutes: 0 };

const currentUser = localStorage.getItem(USER_INFO);

const ConfirmPage = ({ dispatch, state }: BookingComponentType) => {
  const history = useHistory();
  const mapped: HrsAndMinsType = parseHoursToObject(
    state.schedules.selectedHour
  );
  const parsedDate = DateTime.fromISO(state.schedules.selectedDate).set({
    hour: 0,
    minute: 0,
    millisecond: 0,
  });

  const event = {
    summary: 'OSTEOPATIA CON TEO',
    location: 'via Osti',
    description: 'trattamento osteopatico',
    start: {
      dateTime: parsedDate.plus(mapped).toISO(),
    },
    end: {
      dateTime: parsedDate.plus(mapped).plus(EVENT_DURATION).toISO(),
    },
    colorId: 1,
  };

  const myFunc = async (value: InitialFormType) => {
    const google_token = localStorage.getItem('google_token');
    try {
      const handleSuccess = (response: any) => {};
      await createBooking(handleSuccess, {
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus(EVENT_DURATION).toISO(),
      });
      dispatch({
        type: SET_CONFIRM_PHASE,
        payload: false,
      });
      dispatch({
        type: SET_RENDER_AVAL,
        payload: false,
      });
      if (google_token && google_token !== undefined) {
        await googleCalendarInsertEvent((r: any) => console.log(r), {
          token: localStorage.getItem('google_token'),
          event: event,
        });
      }
      history.push(routes.HOMEPAGE_BOOKING_PAYMENT);
    } catch (e: any) {
      handleToastInFailRequest(e, toast);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`justify-self-start`}
        onClick={() => history.push(routes.HOMEPAGE_BOOKING)}
      >
        <BsFillArrowLeftSquareFill
          onClick={() => {
            dispatch({ type: SET_CONFIRM_PHASE, payload: false });
            dispatch({ type: SET_RENDER_AVAL, payload: false });
          }}
          size="1.5em"
          color="#f59e0b"
        />
      </div>
      <div className={`${TITLE}`}>{i18n.t('confirmPage.confirmDatas')}</div>
      <InfoBooking
        date={state.schedules.selectedDate}
        hours={state.schedules.selectedHour}
      />
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
