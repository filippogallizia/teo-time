import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import Calendar from 'react-calendar';

import { useBookingContext } from '../context/useBookingContext';
import { SET_AVAL, SET_AVAL_AND_SELECTION_DATE } from '../bookingReducer';
import { BookingPhase } from './mobileBkgVersion/MobileBkgVersion';
import {
  DATE_TO_DATE_AT_END_OF_DAY,
  DATE_TO_DATE_AT_START_OF_DAY,
} from 'src/helpers/utils';
import BookingPageApi from '../BookingPageApi';
import ToastService from 'src/services/ToastService';

type Props = {
  setBookingPhase?: React.Dispatch<React.SetStateAction<BookingPhase>>;
};

export const getAvailabilities = async (selectedDate: DateTime) => {
  const endOfDay = DATE_TO_DATE_AT_END_OF_DAY(selectedDate);
  const startOfDay = DATE_TO_DATE_AT_START_OF_DAY(selectedDate);
  try {
    const response = await BookingPageApi.getAvailabilities({
      start: startOfDay,
      end: endOfDay,
    });
    return response;
  } catch (e: any) {
    ToastService.error(e);
  }
};

const fetchAndSetAval = async (date: string, dispatch: any) => {
  const selDate = DateTime.fromISO(date);
  const availabilities = await getAvailabilities(selDate);
  dispatch({ type: SET_AVAL, payload: availabilities });
};

function CalendarComponent({ setBookingPhase }: Props) {
  const { state, dispatch } = useBookingContext();

  useEffect(() => {
    // here we fetch availabilities all the time we mouont the component
    fetchAndSetAval(state.schedules.selectedDate, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAvalAndSetAvalAndSelectedDate = async (date: Date) => {
    try {
      const availabilities = await getAvailabilities(DateTime.fromJSDate(date));

      dispatch({
        type: SET_AVAL_AND_SELECTION_DATE,
        payload: {
          availabilities,
          selectedDate: DateTime.fromJSDate(date).toISO(),
        },
      });
    } catch (error) {
      ToastService.error(error);
    }
  };

  const handleChange = async (date: Date) => {
    fetchAvalAndSetAvalAndSelectedDate(date);
    setBookingPhase && setBookingPhase(BookingPhase.VIEW_AVAIL);
  };

  return (
    <Calendar
      minDate={new Date()}
      onChange={handleChange}
      value={DateTime.fromISO(state.schedules.selectedDate).toJSDate()}
    />
  );
}
export default CalendarComponent;
