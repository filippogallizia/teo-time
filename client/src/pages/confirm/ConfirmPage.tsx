import { DateTime } from 'luxon';
import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import GeneralButton from '../../component/GeneralButton';
import { BOOKING_INFO, TITLE } from '../../constants/constant';
import routes from '../../routes';
import { parseHoursToObject } from '../../helpers/utils';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { SET_CONFIRM_PHASE, SET_RENDER_AVAL } from '../booking/stateReducer';
import i18n from '../../i18n';
import InfoBooking from '../admin/components/InfoBooking';
import { HrsAndMinsType } from '../../../types/Types';
//import { googleCalendarInsertEvent } from '../auth/AuthApi/LoginService';
import BookingPageApi from '../booking/BookingPageApi';
import LocalStorageManager from '../../services/StorageService';
import ToastService from '../../services/ToastService';

type InitialFormType = {
  name: string;
  email: string;
  phoneNumber: number;
};

const EVENT_DURATION = { hours: 1, minutes: 0 };

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

  const booking = {
    start: parsedDate.plus(mapped).toISO(),
    end: parsedDate.plus(mapped).plus(EVENT_DURATION).toISO(),
  };

  const myFunc = async (value: InitialFormType) => {
    try {
      await BookingPageApi.createBooking(booking);
      LocalStorageManager.setItem(BOOKING_INFO, booking);
      dispatch({
        type: SET_CONFIRM_PHASE,
        payload: false,
      });
      dispatch({
        type: SET_RENDER_AVAL,
        payload: false,
      });

      /**
       * TODO -> google calendar for client
       */

      //const google_token = localStorage.getItem('google_token');
      //if (google_token && google_token !== undefined) {
      //await googleCalendarInsertEvent((r: any) => console.log(r), {
      //  token: localStorage.getItem('google_token'),
      //  event: event,
      //});
      //const event = {
      //  summary: 'OSTEOPATIA CON TEO',
      //  location: 'via Osti',
      //  description: 'trattamento osteopatico',
      //  start: {
      //    dateTime: parsedDate.plus(mapped).toISO(),
      //  },
      //  end: {
      //    dateTime: parsedDate.plus(mapped).plus(EVENT_DURATION).toISO(),
      //  },
      //  colorId: 1,
      //};
      //}

      history.push(routes.HOMEPAGE_BOOKING_PAYMENT);
    } catch (e: any) {
      ToastService.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`justify-self-start cursor-pointer`}
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
