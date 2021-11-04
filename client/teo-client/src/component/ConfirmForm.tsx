import { DateTime } from 'luxon';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_APPOINTMENT_DETAILS,
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../pages/booking/bookingReducer';
import { createBooking } from '../services/calendar.service';
import GeneralButton from './GeneralButton';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../shared/locales/constant';
import Routes from '../routes';
import EventListener from '../helpers/EventListener';
import {
  handleToastInFailRequest,
  parseHoursToObject,
} from '../shared/locales/utils';
import { toast } from 'react-toastify';

type InitialFormType = {
  name: string;
  email: string;
  phoneNumber: number;
};

const ConfirmForm = ({ dispatch, state }: BookingComponentType) => {
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
      history.push(Routes.HOMEPAGE_SUCCESS);
    } catch (e: any) {
      handleToastInFailRequest(e, toast);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 justify-items-center">
      <div className={`${TITLE} ${MARGIN_BOTTOM}`}>Conferma i dati</div>
      <div className={MARGIN_BOTTOM}>
        <p className={TITLE}>
          {`Data:  `}{' '}
          <span className={BOLD}>
            {DateTime.fromISO(state.schedules.selectedDate).toFormat(
              'yyyy LLL dd'
            )}{' '}
            {''}
            {DateTime.fromISO(state.schedules.selectedHour).toFormat('t')}
          </span>
        </p>
      </div>
      {/* <div>email: blabjag</div> */}
      <div>
        <GeneralButton buttonText="PRENOTA" onClick={myFunc} />
      </div>
    </div>
  );
};

export default ConfirmForm;
