import React, { Dispatch, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import AvailabilityHourContainer from './AvailabilityHourContainer';
import { BOLD, GRID_ONE_COL, TITLE } from '../shared/locales/constant';
import { DateTime } from 'luxon';
import { getAvailabilities } from '../services/calendar.service';
import {
  Actions,
  InitialState,
  SET_AVAILABILITIES,
  timeRange,
} from '../pages/booking/bookingReducer';
import {
  FROM_DATE_TO_DAY,
  FROM_DATE_TO_HOUR,
  HOUR_MINUTE_FORMAT,
} from '../shared/locales/utils';
import EventListener from '../helpers/EventListener';

type BookSlotContainerType = {
  state: InitialState;
  dispatch: Dispatch<Actions>;
};

function AvailabilitiesContainer({ dispatch, state }: BookSlotContainerType) {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });

  const [hours, setHours] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    const setAvailabilities = (response: any) => {
      dispatch({ type: SET_AVAILABILITIES, payload: response });
    };
    const parsedDate = DateTime.fromISO(state.schedules.selectedDate);
    const startOfDay = DateTime.fromISO(state.schedules.selectedDate).set({
      hour: 7,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const funcAsync = async () => {
      try {
        await getAvailabilities(setAvailabilities, {
          start: startOfDay.toISO(),
          end: parsedDate
            .set({
              hour: 23,
              minute: 59,
              second: 0,
              millisecond: 0,
            })
            .toISO(),
        });
      } catch (e: any) {
        EventListener.emit('errorHandling', e.response);
      }
    };
    funcAsync();
  }, [dispatch, state.schedules.selectedDate, state.schedules.selectedHour]);

  useEffect(() => {
    setHours(() => {
      if (state.schedules.availabilities.length > 0) {
        // if the date is today show availabilities just after the current hour
        return state.schedules.availabilities.reduce(
          (acc: { start: string; end: string }[], cv: timeRange) => {
            const availabilitiesDay = FROM_DATE_TO_DAY(cv.start);
            const availabilitiesHours = FROM_DATE_TO_HOUR(cv.start);
            const currentDay = FROM_DATE_TO_DAY(new Date().toISOString());
            const currentHour = FROM_DATE_TO_HOUR(new Date().toISOString());
            if (
              availabilitiesDay === currentDay &&
              DateTime.fromISO(state.schedules.selectedDate).toFormat(
                'yyyy LLL dd'
              ) === DateTime.fromJSDate(new Date()).toFormat('yyyy LLL dd')
            ) {
              if (availabilitiesHours > currentHour) {
                acc.push({
                  start: HOUR_MINUTE_FORMAT(cv.start),
                  end: DateTime.fromISO(cv.start)
                    .plus({ hours: 1 })
                    .toFormat('HH:mm'),
                });
              }
            } else {
              acc.push({
                start: HOUR_MINUTE_FORMAT(cv.start),
                end: DateTime.fromISO(cv.start)
                  .plus({ hours: 1 })
                  .toFormat('HH:mm'),
              });
            }
            return acc;
          },
          []
        );
      } else return [];
    });
  }, [state.schedules.availabilities, state.schedules.selectedDate]);

  return (
    <div
      className={`${GRID_ONE_COL} w-full border-2 border-gray-50 md:border-none`}
    >
      <div className={` ${GRID_ONE_COL} md:hidden`}>
        <p className={`${BOLD} ${TITLE}`}>SELECT A TIME</p>
        <p>{`${DateTime.fromISO(state.schedules.selectedDate).year}/${
          DateTime.fromISO(state.schedules.selectedDate).month
        }/${DateTime.fromISO(state.schedules.selectedDate).day}`}</p>
        <p>Duration: 60 min</p>
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

export default AvailabilitiesContainer;
