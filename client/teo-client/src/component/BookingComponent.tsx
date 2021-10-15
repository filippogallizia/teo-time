import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AvailabilitiesContainer from '../component/AvailabilitiesContainer';
import CalendarComponent from '../component/Caledar';
import EventInformations from '../component/EventInformations';
import { FLEX_DIR_COL, TAILWIND_MOBILE_BREAKPOINT } from '../constant';

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

type BookingComponentMobileType = {
  isBookSlotView: boolean;
  setIsBookSlotView: Dispatch<SetStateAction<boolean>>;
};

const BookingComponentMobile = ({
  isBookSlotView,
  setIsBookSlotView,
}: BookingComponentMobileType) => {
  return (
    <div>
      {isBookSlotView ? (
        <AvailabilitiesContainer setIsBookSlotView={setIsBookSlotView} />
      ) : (
        <div className="flex justify-center ">
          <div style={{ maxWidth: '600px' }}>
            <EventInformations />
            <CalendarComponent setIsBookSlotView={setIsBookSlotView} />
          </div>
        </div>
      )}
    </div>
  );
};

const BookingComponentDesktop = () => {
  return (
    <div className="flex justify-center ">
      <EventInformations />
      <div className="flex justify-center ">
        <div style={{ maxWidth: '600px' }}>
          <CalendarComponent />
        </div>
      </div>
      <AvailabilitiesContainer />
    </div>
  );
};

export default BookingComponent;
