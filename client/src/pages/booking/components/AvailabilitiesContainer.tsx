import React, { useEffect, useState } from 'react';
import AvailabilityHourContainer from './AvailabilityHourContainer';
import {
  EVENT_INFO_TEXT,
  GRID_ONE_COL,
  MEDIUM_MARGIN_TOP,
  SUB_TITLE,
} from '../../../constants/constant';
import { DateTime } from 'luxon';

import i18n from '../../../i18n';
import { compareAvailWithCurrentHour } from '../helpers/helpers';

import { useBookingContext } from '../context/useBookingContext';

function AvalContainer() {
  const [isClicked, setIsClicked] = useState({ id: 0, isOpen: false });
  const { state } = useBookingContext();

  const [hours, setHours] = useState<{ start: string; end: string }[]>([]);

  const selectedDate = DateTime.fromISO(state.schedules.selectedDate);

  useEffect(() => {
    // those ones are the hours available to render on the screen for the user.
    if (
      state.schedules.availabilities &&
      state.schedules.availabilities.length > 0
    ) {
      // if the date is today show availabilities just after the current hour
      const hrs = compareAvailWithCurrentHour(
        state.schedules.availabilities,
        state.schedules.selectedDate
      );
      setHours(hrs);
    } else {
      setHours([]);
    }
  }, [state.schedules.availabilities, state.schedules.selectedDate]);

  console.log('hours', hours);

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

        <p className={EVENT_INFO_TEXT}>
          {`${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`}
        </p>

        <p className={EVENT_INFO_TEXT}>Durata: 60 min</p>
      </div>

      {hours.length === 0 && <div>NESSUNA ORA DISPONIBILE</div>}

      {hours.length > 0 &&
        hours.map((hour, i) => {
          return (
            <AvailabilityHourContainer
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

export default AvalContainer;
