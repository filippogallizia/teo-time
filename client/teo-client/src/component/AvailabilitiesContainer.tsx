import React, { Dispatch, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import AvailabilityHourContainer from './AvailabilityHourContainer';
import { BOLD, FLEX_DIR_COL, MARGIN_BOTTOM, TITLE } from '../constant';
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
} from '../utils';

type BookSlotContainerType = {
  state: InitialState;
  dispatch: Dispatch<Actions>;
};

function AvailabilitiesContainer({ dispatch, state }: BookSlotContainerType) {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });

  const [hours, setHours] = useState<any[]>([]);

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
      } catch (e) {
        console.log(e);
      }
    };
    funcAsync();
  }, [dispatch, state.schedules.selectedDate, state.schedules.selectedHour]);

  useEffect(() => {
    setHours(() => {
      // if (state.schedules.availabilities.length > 0) {
      //   return state.schedules.availabilities.map((av: any) => {
      //     return {
      //       start: state.schedules.availabilities.toFormat('HH:mm'),
      //     };
      //   });
      // } else return [];
      console.log(
        DateTime.fromISO(state.schedules.selectedDate).toFormat(
          'yyyy LLL dd'
        ) === DateTime.fromJSDate(new Date()).toFormat('yyyy LLL dd')
      );
      if (state.schedules.availabilities.length > 0) {
        return state.schedules.availabilities.reduce(
          (acc: { start: string }[], cv: timeRange) => {
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
                acc.push({ start: HOUR_MINUTE_FORMAT(cv.start) });
              }
            } else {
              acc.push({ start: HOUR_MINUTE_FORMAT(cv.start) });
            }
            return acc;
          },
          []
        );
      } else return [];
    });
  }, [state.schedules.availabilities]);

  return (
    <div
      className={`flex flex-col items-center w-full border-2 border-gray-50 md:border-none`}
    >
      <div className={`${MARGIN_BOTTOM}  ${FLEX_DIR_COL} md:hidden`}>
        <p className={`${BOLD} ${MARGIN_BOTTOM} ${TITLE}`}>SELECT A TIME</p>
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
