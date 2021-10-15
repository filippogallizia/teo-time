import React, { useEffect, useState } from 'react';
import BookingComponentDesktop from '../../component/BookingComponent_Desktop';
import BookingComponentMobile from '../../component/BookingComponent_Mobile';
import { TAILWIND_MOBILE_BREAKPOINT } from '../../constant';

function BookingComponent() {
  const [isMobile, setIsMobile] = useState({ width: window.innerWidth });
  const [isBookSlotView, setIsBookSlotView] = useState(false);

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
        <BookingComponentMobile
          isBookSlotView={isBookSlotView}
          setIsBookSlotView={setIsBookSlotView}
        />
      ) : (
        <BookingComponentDesktop />
      )}
    </>
  );
}

export default BookingComponent;
