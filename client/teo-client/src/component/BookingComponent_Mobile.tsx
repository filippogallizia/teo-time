import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import ConfirmForm from './ConfirmForm';
import EventInformations from './EventInformations';

const BookingInfo = ({ dispatch, state }: BookingComponentType) => {
  return (
    <>
      {state.schedules.isRenderAvailabilities ? (
        <div>
          <AvailabilitiesContainer dispatch={dispatch} state={state} />
        </div>
      ) : (
        <div className="flex justify-center">
          <div style={{ maxWidth: '600px' }}>
            <CalendarComponent state={state} dispatch={dispatch} />
          </div>
        </div>
      )}
    </>
  );
};

const BookingComponentMobile = ({ dispatch, state }: BookingComponentType) => {
  return (
    <div>
      <EventInformations dispatch={dispatch} state={state} />
      {state.schedules.isConfirmPhase ? (
        <ConfirmForm state={state} dispatch={dispatch} />
      ) : (
        <BookingInfo dispatch={dispatch} state={state} />
      )}
    </div>
  );
};

export default BookingComponentMobile;
