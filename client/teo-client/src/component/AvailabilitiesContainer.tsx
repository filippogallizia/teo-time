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
  setSelectionHour: Dispatch<SetStateAction<string>>;
};

function AvailabilitiesContainer({
  setRenderAvailabilities,
  setSelectionHour,
}: BookSlotContainerType) {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });
  const [availabilities, setAvailabilities] = useState<
    {
      start: string;
      end: string;
    }[]
  >([]);
  const [hours, setHours] = useState<any[]>([]);

  useEffect(() => {
    getAvailabilities(setAvailabilities);
  }, []);

  useEffect(() => {
    setHours(() => {
      if (availabilities.length > 0) {
        return availabilities.map((av) => {
          return {
            start: DateTime.fromISO(av.start).toFormat('HH:mm'),
          };
        });
      } else return [];
    });
  }, [availabilities]);

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
            key={i + 2}
            setIsClicked={setIsClicked}
            isClicked={isClicked}
            setSelectionHour={setSelectionHour}
            id={i}
            hour={hour}
          />
        );
      })}
    </div>
  );
}

export default AvailabilitiesContainer;