import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import BookSlotChild from './BookSlotChild';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import {
  BOLD,
  FLEX_DIR_COL,
  MARGIN_BOTTOM,
  MARGIN_RIGHT,
  MEDIUMPADDING,
  TITLE,
} from '../constant';
import { getBooking } from '../service/calendar.service';
import { DateTime } from 'luxon';

type BookSlotHeaderType = {
  setIsBookSlotView?: Dispatch<SetStateAction<boolean>>;
};

const BookSlotHeader = ({ setIsBookSlotView }: BookSlotHeaderType) => {
  return (
    <div
      className={`w-full relative flex justify-center ${MEDIUMPADDING} border-2 border-gray-50 md:border-none `}
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
          onClick={() => setIsBookSlotView && setIsBookSlotView(false)}
          size="1.5em"
          color="blue"
        />
      </div>
    </div>
  );
};

type AvailabilitiesContainerType = {
  setIsBookSlotView?: Dispatch<SetStateAction<boolean>>;
};

function AvailabilitiesContainer({
  setIsBookSlotView,
}: AvailabilitiesContainerType) {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });
  const [avaliabilities, setAvaliabilities] = useState<
    { start: string; end: string }[]
  >([]);
  const [hours, setHours] = useState<any>([]);

  useEffect(() => {
    getBooking(setAvaliabilities);
  }, []);

  useEffect(() => {
    setHours(() => {
      return avaliabilities.map((av) => {
        return DateTime.fromISO(av.start).hour;
      });
    });
  }, [avaliabilities]);

  return (
    <div
      className={`${FLEX_DIR_COL} w-full border-2 border-gray-50 md:border-none`}
    >
      <BookSlotHeader setIsBookSlotView={setIsBookSlotView} />

      <div
        className={`${MARGIN_BOTTOM} ${MEDIUMPADDING} ${FLEX_DIR_COL} md:hidden`}
      >
        <p className={`${BOLD} ${MARGIN_BOTTOM} ${TITLE}`}>SELECT A TIME</p>
        <p>Duration: 60 min</p>
      </div>
      {hours.map((slot: any, i: number) => {
        return (
          <BookSlotChild
            setIsClicked={setIsClicked}
            isClicked={isClicked}
            id={i}
            hours={slot}
          />
        );
      })}
    </div>
  );
}

export default AvailabilitiesContainer;
