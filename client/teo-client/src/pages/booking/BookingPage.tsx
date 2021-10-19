import { DateTime } from 'luxon';
import React, { useEffect, useState, useReducer } from 'react';
import BookingComponentDesktop from '../../component/BookingComponent_Desktop';
import BookingComponentMobile from '../../component/BookingComponent_Mobile';
import { TAILWIND_MOBILE_BREAKPOINT } from '../../constant';
import { parseHoursToObject } from '../../helpers/helpers';
import bookingReducer from './bookingReducer';

const today = new Date();
today.setHours(0, 0, 0, 0);

const startingAvailabilities = new Date();
startingAvailabilities.setHours(7, 0, 0, 0);

const endAvailabilities = new Date();
endAvailabilities.setHours(20, 30, 0, 0);

const initialState = {
  schedules: {
    selectedDate: today,
    selectedHour: '00:00',
    availabilities: [
      {
        start: startingAvailabilities.toISOString(),
        end: endAvailabilities.toISOString(),
      },
    ],
    isConfirmPhase: false,
    isRenderAvailabilities: false,
  },
};

function BookingPage() {
  const [isMobile, setIsMobile] = useState({ width: window.innerWidth });
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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

  return (
    <>
      {isMobile.width <= TAILWIND_MOBILE_BREAKPOINT ? (
        <BookingComponentMobile dispatch={dispatch} state={state} />
      ) : (
        <BookingComponentDesktop dispatch={dispatch} state={state} />
      )}
    </>
  );
}

export default BookingPage;
