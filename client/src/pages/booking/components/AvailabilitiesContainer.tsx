import React, { Dispatch, useEffect, useState } from 'react';
import AvailabilityHourContainer from './AvailabilityHourContainer';
import {
  EVENT_INFO_TEXT,
  GRID_ONE_COL,
  MEDIUM_MARGIN_TOP,
  SUB_TITLE,
} from '../../../constants/constant';
import { DateTime } from 'luxon';

import { Actions, InitialState, SET_AVAL } from '../stateReducer';

import i18n from '../../../i18n';
import BookingPageApi from '../BookingPageApi';
import { compareAvailWithCurrentHour } from '../helpers/helpers';
import ToastService from '../../../services/ToastService';

type BookSlotContainerType = {
  state: InitialState;
  dispatch: Dispatch<Actions>;
};

function AvalContainer({ dispatch, state }: BookSlotContainerType) {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });

  const [hours, setHours] = useState<{ start: string; end: string }[]>([]);

  const selectedDate = DateTime.fromISO(state.schedules.selectedDate);

  useEffect(() => {
    const selectedDate = DateTime.fromISO(state.schedules.selectedDate);
    const handleSuccess = (response: any) => {
      dispatch({ type: SET_AVAL, payload: response });
    };

    //create the start and end filter to get availabilities from api.
    const parsedDate = selectedDate
      .set({
        hour: 23,
        minute: 59,
        second: 0,
        millisecond: 0,
      })
      .toISO();
    const startOfDay = selectedDate
      .set({
        hour: 1,
        minute: 1,
        second: 1,
        millisecond: 0,
      })
      .toISO();

    const funcAsync = async () => {
      try {
        const response = await BookingPageApi.getAvailabilities({
          start: startOfDay,
          end: parsedDate,
        });
        handleSuccess(response);
      } catch (e: any) {
        //EventListener.emit('errorHandling', e.response);
        ToastService.error(e);
      }
    };
    funcAsync();
  }, [dispatch, state.schedules.selectedDate, state.schedules.selectedHour]);

  useEffect(() => {
    // those ones are the hours available to render on the screen for the user.
    setHours(() => {
      if (state.schedules.availabilities.length > 0) {
        // if the date is today show availabilities just after the current hour
        return compareAvailWithCurrentHour(
          state.schedules.availabilities,
          state.schedules.selectedDate
        );
      } else return [];
    });
  }, [state.schedules.availabilities, state.schedules.selectedDate]);

  return (
    <div
      className={`${GRID_ONE_COL} w-full border-2 border-gray-50 md:border-none`}
    >
      <div
        className={` ${GRID_ONE_COL} ${MEDIUM_MARGIN_TOP} md:hidden md:mt-0`}
      >
        <p className={`${SUB_TITLE}`}>
          {i18n.t('availabilitiesContainer.title')}
        </p>
        <p
          className={EVENT_INFO_TEXT}
        >{`${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`}</p>
        <p className={EVENT_INFO_TEXT}>Duration: 60 min</p>
      </div>
      {hours.length === 0 ? (
        <div>NESSUNA ORA DISPONIBILE</div>
      ) : (
        hours.map((hour, i) => {
          return (
            <AvailabilityHourContainer
              state={state}
              dispatch={dispatch}
              key={i + 2}
              setIsClicked={setIsClicked}
              isClicked={isClicked}
              id={i}
              hour={hour}
            />
          );
        })
      )}
    </div>
  );
}

export default AvalContainer;
