import { DateTime } from 'luxon';
import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import GeneralButton from '../../component/GeneralButton';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
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
  const myFunc = async (value: InitialFormType) => {
    try {
      const handleSuccess = (response: any) => {};
      await createBooking(handleSuccess, {
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus(EVENT_DURATION).toISO(),
        email: value.email,
      });
      dispatch({
        type: SET_CONFIRM_PHASE,
        payload: false,
      });
      dispatch({
        type: SET_RENDER_AVAL,
        payload: false,
      });
      history.push(routes.HOMEPAGE_SUCCESS);
    } catch (e: any) {
      handleToastInFailRequest(e, toast);
    }
  };

  return (
    <div className="grid  grid-cols-1 gap-8  justify-items-center relative">
      <div
        className={`absolute top-1 left-3 md:static`}
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
      <div className={`${TITLE} ${MARGIN_BOTTOM}`}>
        {i18n.t('confirmPage.confirmDatas')}
      </div>
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
