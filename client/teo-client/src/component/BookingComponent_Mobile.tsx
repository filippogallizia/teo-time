import { useEffect, useState } from 'react';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import ConfirmForm from './ConfirmForm';
import EventInformations from './EventInformations';

const ComponentApart = ({ dispatch, state }: BookingComponentType) => {
  return (
    <>
      {state.schedules.isRenderAvailabilities ? (
        <div className="mt-4">
          <AvailabilitiesContainer dispatch={dispatch} state={state} />
        </div>
      ) : (
        <div className="flex justify-center">
          <div style={{ maxWidth: '600px' }}>
            <CalendarComponent state={state} dispatch={dispatch} />
            {/* <ConfirmForm /> */}
          </div>
        </div>
      )}
    </>
  );
};

const BookingComponentMobile = ({ dispatch, state }: BookingComponentType) => {
  // to check margintop

  return (
    <div className="overflow-y-visible">
      <EventInformations dispatch={dispatch} state={state} />
      {state.schedules.isConfirmPhase ? (
        <ConfirmForm />
      ) : (
        <ComponentApart dispatch={dispatch} state={state} />
      )}
    </div>
  );
};

export default BookingComponentMobile;
