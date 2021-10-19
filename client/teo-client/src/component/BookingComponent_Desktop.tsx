import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import ConfirmForm from './ConfirmForm';
import EventInformations from './EventInformations';

const BookingComponentDesktop = ({ dispatch, state }: BookingComponentType) => {
  return (
    <div className="grid  grid-cols-3 gap-4 ">
      <div className="col-span-1">
        <EventInformations state={state} dispatch={dispatch} />
      </div>
      {state.schedules.isConfirmPhase ? (
        <div className="bg-blue-400 col-span-2">
          <ConfirmForm />
        </div>
      ) : (
        <>
          <div className="col-span-2 ">
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
