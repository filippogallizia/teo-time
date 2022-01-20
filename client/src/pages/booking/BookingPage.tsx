import React, { useEffect, useState } from 'react';
import AvalContainer from './components/AvailabilitiesContainer';
import CalendarComponent from './components/Caledar';
import EventInformations from './components/EventInformations';
import { TAILWIND_MOBILE_BREAKPOINT } from '../../shared/locales/constant';
import { BookingComponentType } from './BookingPageTypes';
import { SET_CONFIRM_PHASE, SET_RENDER_AVAL } from './stateReducer';

function BookingPage({ dispatch, state }: BookingComponentType) {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth });

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
    dispatch({ type: SET_CONFIRM_PHASE, payload: false });
    dispatch({
      type: SET_RENDER_AVAL,
      payload: false,
    });
  }, [dispatch]);

  useEffect(() => {
    const logResize = () => {
      setDimensions({ width: window.innerWidth });
    };
    const debouncedHandleResize = debounce(logResize, 0.5);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  const IS_MOBILE = dimensions.width <= TAILWIND_MOBILE_BREAKPOINT;

  if (IS_MOBILE) {
    return (
      <div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4">
            <EventInformations state={state} dispatch={dispatch} />
          </div>
          <div className="col-span-4">
            {state.schedules.isRenderAval && (
              <div>
                <AvalContainer dispatch={dispatch} state={state} />
              </div>
            )}
            {!state.schedules.isRenderAval && (
              <div className="flex justify-center">
                <div style={{ maxWidth: '600px' }}>
                  <CalendarComponent state={state} dispatch={dispatch} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-4">
            <EventInformations state={state} dispatch={dispatch} />
          </div>
          <div className="col-span-2">
            <div style={{ maxWidth: '600px' }}>
              <CalendarComponent state={state} dispatch={dispatch} />
            </div>
          </div>
          <div className="col-span-2">
            <AvalContainer dispatch={dispatch} state={state} />
          </div>
        </div>
      </div>
    );
  }
}

export default BookingPage;
