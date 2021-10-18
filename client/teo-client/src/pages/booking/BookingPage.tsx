import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import BookingComponentDesktop from '../../component/BookingComponent_Desktop';
import BookingComponentMobile from '../../component/BookingComponent_Mobile';
import { TAILWIND_MOBILE_BREAKPOINT } from '../../constant';
import { createBooking } from '../../service/calendar.service';

function BookingPage() {
  const [isMobile, setIsMobile] = useState({ width: window.innerWidth });
  const [selectedDate, setSelectionDate] = useState(new Date());

  const [selectedHour, setSelectionHour] = useState('00:00');

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
        start: '2021-10-05T08:30:00.000',
        end: '2021-10-05T10:00:00.000',
      });
    } catch (e) {
      console.log(e);
    }
  }, [selectedHour]);

  // const transormation = () => {
  //   let flag = false;
  //   const h = selectedHour.split('').reduce((acc, cv) => {
  //     if (cv === ':') {
  //       flag = true;
  //       return acc;
  //     }
  //     if (acc.length === 2 || flag) return acc;
  //     if (cv === '0' && acc.length === 0) return acc;
  //     //@ts-expect-error
  //     acc.push(cv);
  //     return acc;
  //   }, []);
  //   return h;
  // };

  const transormation = (): { hours: number; minutes: number } => {
    let flag = false;
    let wasZero = false;
    const h = selectedHour.split('').reduce(
      (acc, cv) => {
        if (cv === ':') {
          flag = true;
          return acc;
        }
        if (acc.hours.length === 0 && cv === '0') {
          return acc;
        }
        if (acc.hours.length === 2 || wasZero) {
          //@ts-expect-error
          acc.minutes.push(cv);
          return acc;
        }
        if (acc.hours.length === 1 && flag) {
          //@ts-expect-error
          acc.minutes.push(cv);
          return acc;
        }
        if (flag) return acc;
        //@ts-expect-error
        acc.hours.push(cv);
        return acc;
      },
      { hours: [], minutes: [] }
    );
    const x = Number(h.minutes.join(''));
    const y = Number(h.hours.join(''));
    //@ts-expect-error
    h.minutes = x;
    //@ts-expect-error
    h.hours = y;
    //@ts-expect-error
    return h;
  };
  const mapped: { hours: number; minutes: number } = transormation();
  const parsedDate = DateTime.fromISO(selectedDate.toISOString()).plus(mapped);

  return (
    <>
      {isMobile.width <= TAILWIND_MOBILE_BREAKPOINT ? (
        <BookingComponentMobile
          setSelectionDate={setSelectionDate}
          selectedDate={selectedDate}
          setSelectionHour={setSelectionHour}
        />
      ) : (
        <BookingComponentDesktop
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
