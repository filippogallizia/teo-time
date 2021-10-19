import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import AvailabilityHourContainer from './AvailabilityHourContainer';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import {
  BOLD,
  FLEX_DIR_COL,
  MARGIN_BOTTOM,
  MARGIN_RIGHT,
  GLOBAL_PADDING,
  TITLE,
} from '../constant';
import { DateTime } from 'luxon';
import { getAvailabilities } from '../service/calendar.service';
import {
  Actions,
  InitialState,
  SET_AVAILABILITIES,
} from '../pages/booking/bookingReducer';

type BookSlotHeaderType = {
  setRenderAvailabilities?: Dispatch<SetStateAction<boolean>>;
};

const AvailabilityContainerHeader = ({
  setRenderAvailabilities,
}: BookSlotHeaderType) => {
  return (
    <div
      className={`w-full relative flex justify-center ${GLOBAL_PADDING} border-2 border-gray-50 md:border-none md:pt-0`}
    >
      <div className={`${MARGIN_BOTTOM} md:flex`}>
        <p className={`${BOLD} ${MARGIN_BOTTOM} md:${MARGIN_RIGHT}`}>
          Wednesday
        </p>
        <p>11/05/2021</p>
      </div>
      <div
        className={`absolute top-4 left-3 ${MARGIN_BOTTOM} md:hidden overflow-x-auto`}
      >
        <BsFillArrowLeftSquareFill
          onClick={() =>
            setRenderAvailabilities && setRenderAvailabilities(false)
          }
          size="1.5em"
          color="blue"
        />
      </div>
    </div>
  );
};

type BookSlotContainerType = {
  setRenderAvailabilities?: Dispatch<SetStateAction<boolean>> | undefined;
  state: InitialState;
  dispatch: Dispatch<Actions>;
};

function AvailabilitiesContainer({
  setRenderAvailabilities,
  dispatch,
  state,
}: BookSlotContainerType) {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });

  const [hours, setHours] = useState<any[]>([]);

  useEffect(() => {
    const setAvailabilities = (response: any) => {
      dispatch({ type: SET_AVAILABILITIES, payload: response });
    };
    const parsedDate = DateTime.fromJSDate(state.schedules.selectedDate);
    const funcAsync = async () => {
      try {
        await getAvailabilities(setAvailabilities, {
          start: state.schedules.selectedDate.toISOString(),
          end: parsedDate.plus({ hours: 23, minutes: 59 }).toISO(),
        });
      } catch (e) {
        console.log(e);
      }
    };
    funcAsync();
  }, [dispatch, state.schedules.selectedDate, state.schedules.selectedHour]);

  useEffect(() => {
    setHours(() => {
      if (state.schedules.availabilities.length > 0) {
        return state.schedules.availabilities.map((av: any) => {
          return {
            start: DateTime.fromISO(av.start).toFormat('HH:mm'),
          };
        });
      } else return [];
    });
  }, [state.schedules.availabilities]);

  return (
    <div
      className={`${FLEX_DIR_COL} w-full border-2 border-gray-50 md:border-none`}
    >
      <AvailabilityContainerHeader
        setRenderAvailabilities={
          setRenderAvailabilities && setRenderAvailabilities
        }
      />

      <div
        className={`${MARGIN_BOTTOM} ${GLOBAL_PADDING} ${FLEX_DIR_COL} md:hidden`}
      >
        <p className={`${BOLD} ${MARGIN_BOTTOM} ${TITLE}`}>SELECT A TIME</p>
        <p>Duration: 60 min</p>
      </div>
      {hours.map((hour, i) => {
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
      })}
    </div>
  );
}

export default AvailabilitiesContainer;
