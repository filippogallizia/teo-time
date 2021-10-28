import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import ConfirmForm from './ConfirmForm';
import EventInformations from './EventInformations';

const BookingComponentDesktop = ({ dispatch, state }: BookingComponentType) => {
  return (
    <div className="grid grid-cols-4 justify-items-center gap-2 ">
      <div className="col-span-4">
        <EventInformations state={state} dispatch={dispatch} />
      </div>
      {state.schedules.isConfirmPhase ? (
        <div className="col-span-4">
          <ConfirmForm state={state} dispatch={dispatch} />
        </div>
      ) : (
        <>
          <div className="col-span-4 ">
            <div className="grid  grid-cols-2">
              <div style={{ maxWidth: '600px' }}>
                <CalendarComponent state={state} dispatch={dispatch} />
              </div>
              <AvailabilitiesContainer state={state} dispatch={dispatch} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingComponentDesktop;
