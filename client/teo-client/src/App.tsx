import React, { useEffect, useState } from 'react';
import './App.css';
import BookSlotContainer from './component/BookSlotContainer';
import CalendarComponent from './component/Caledar';
import { TAILWIND_MOBILE_BREAKPOINT } from './constant';

const HomeLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col justify-center h-screen md:items-center">
      {children}
    </div>
  );
};

function App() {
  const [isBookSlotView, setIsBookSlotView] = useState(false);
  const [isMobile, setIsMobile] = useState({ width: window.innerWidth });

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
    <HomeLayout>
      <>
        {isMobile.width <= TAILWIND_MOBILE_BREAKPOINT ? (
          <div>
            {isBookSlotView ? (
              <BookSlotContainer setIsBookSlotView={setIsBookSlotView} />
            ) : (
              <CalendarComponent setIsBookSlotView={setIsBookSlotView} />
            )}
          </div>
        ) : (
          <div className="md:flex w-1/2 justify-evenly">
            <CalendarComponent setIsBookSlotView={setIsBookSlotView} />
            {isBookSlotView ? (
              <BookSlotContainer setIsBookSlotView={setIsBookSlotView} />
            ) : null}
          </div>
        )}
      </>
    </HomeLayout>
  );
}

export default App;
