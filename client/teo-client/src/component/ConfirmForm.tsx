import { DateTime } from 'luxon';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { parseHoursToObject } from '../helpers/helpers';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import { SET_APPOINTMENT_DETAILS } from '../pages/booking/bookingReducer';
import { createBooking } from '../services/calendar.service';
import GeneralButton from './GeneralButton';
import { MARGIN_BOTTOM, TITLE } from '../constant';
import Routes from '../routes';
import EventListener from '../helpers/EventListener';

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
  const myFunc = async (value: InitialFormType) => {
    const parsedDate = DateTime.fromISO(state.schedules.selectedDate);
    try {
      const handleSuccess = (response: any) => {
        dispatch({
          type: SET_APPOINTMENT_DETAILS,
          payload: { id: response.id, start: response.start },
        });
        localStorage.setItem('APPOINTMENT_DETAILS', response.start);
      };
      await createBooking(handleSuccess, {
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus({ hours: 1, minutes: 30 }).toISO(),
        email: value.email,
      });
      history.push(Routes.HOMEPAGE_SUCCESS);
    } catch (e: any) {
      EventListener.emit('errorHandling', e.response);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className={`${TITLE} ${MARGIN_BOTTOM}`}>Conferma i dati</div>
      <div className={MARGIN_BOTTOM}>
        <p className={TITLE}>
          {`Data:  `}{' '}
          <span className="text-green-500">
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
