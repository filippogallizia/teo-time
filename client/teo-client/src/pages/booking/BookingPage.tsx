import { DateTime } from 'luxon';
import React, { useEffect, useState, useReducer } from 'react';
import BookingComponentDesktop from '../../component/BookingComponent_Desktop';
import BookingComponentMobile from '../../component/BookingComponent_Mobile';
import { TAILWIND_MOBILE_BREAKPOINT } from '../../constant';
import { parseHoursToObject } from '../../helpers/helpers';
import { createBooking } from '../../service/calendar.service';
import bookingReducer from './bookingReducer';

const today = new Date();
today.setHours(0, 0, 0, 0);

const initialState = {
  schedules: {
    selectedDate: today,
    selectedHour: '00:00',
    availabilities: [],
  },
};

function BookingPage() {
  const [isMobile, setIsMobile] = useState({ width: window.innerWidth });
  const [selectedDate, setSelectionDate] = useState(new Date());
  const [selectedHour, setSelectionHour] = useState('00:00');
  const [availabilities, setAvailabilities] = useState<
    {
      start: string;
      end: string;
    }[]
  >([]);
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  useEffect(() => {
    const today = new Date();
    setSelectionDate(today);
  }, []);

  function debounce(fn: () => void, ms: number) {
    let timer: any;
    return (_: any) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        //@ts-expect-error
        fn.apply(this, arguments);
      }, ms);
    };
  }

  useEffect(() => {
    const logResize = () => {
      setIsMobile({ width: window.innerWidth });
    };
    const debouncedHandleResize = debounce(logResize, 0.5);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  useEffect(() => {
    try {
      const handleSuccess = (response: any) => {
        console.log(response);
      };
      createBooking(handleSuccess, {
        //@ts-expect-error
        start: parsedDate,
        end: '2021-10-05T10:00:00.000',
      });
    } catch (e) {
      console.log(e);
    }
  }, [selectedHour]);

  const mapped: { hours: number; minutes: number } =
    parseHoursToObject(selectedHour);
  const parsedDate = DateTime.fromISO(selectedDate.toISOString()).plus(mapped);

  console.log(state.schedules.selectedHour, 'hour');

  return (
    <>
      {isMobile.width <= TAILWIND_MOBILE_BREAKPOINT ? (
        <BookingComponentMobile
          dispatch={dispatch}
          setAvailabilities={setAvailabilities}
          availabilities={availabilities}
          setSelectionDate={setSelectionDate}
          selectedDate={selectedDate}
          setSelectionHour={setSelectionHour}
        />
      ) : (
        <BookingComponentDesktop
          dispatch={dispatch}
          availabilities={availabilities}
          setAvailabilities={setAvailabilities}
          setSelectionDate={setSelectionDate}
          selectedDate={selectedDate}
          setSelectionHour={setSelectionHour}
        />
      )}
      <pre style={{ backgroundColor: 'black', color: 'white' }}>
        {JSON.stringify(`${parsedDate} ${selectedHour}`)}
      </pre>
    </>
  );
}

export default BookingPage;
