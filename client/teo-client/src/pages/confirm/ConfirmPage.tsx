import { DateTime } from 'luxon';
import React from 'react';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import GeneralButton from '../../component/GeneralButton';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
import EventListener from '../../helpers/EventListener';
import routes from '../../routes';
import { createBooking } from '../../services/calendar.service';
import { parseHoursToObject } from '../../shared/locales/utils';
import { BookingComponentType } from '../booking/BookingPageTypes';
import {
  SET_APPOINTMENT_DETAILS,
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../booking/bookingReducer';

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
        localStorage.setItem('APPOINTMENT_DETAILS', response.start);
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
      EventListener.emit('errorHandling', e.response);
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
      <div className={`${TITLE} ${MARGIN_BOTTOM}`}>Conferma i dati</div>
      <div className={MARGIN_BOTTOM}>
        <p className={TITLE}>
          Data:
          <span className={BOLD}>
            {DateTime.fromISO(state.schedules.selectedDate).toFormat(
              'yyyy LLL dd'
            )}
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

export default ConfirmPage;
