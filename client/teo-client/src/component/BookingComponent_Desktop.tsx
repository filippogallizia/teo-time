import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import EventInformations from './EventInformations';

const BookingComponentDesktop = ({ dispatch, state }: BookingComponentType) => {
  return (
    <div className="flex justify-center ">
      <EventInformations />
      <div className="flex justify-center ">
        <div style={{ maxWidth: '600px' }}>
          <CalendarComponent state={state} dispatch={dispatch} />
        </div>
      </div>
      <AvailabilitiesContainer state={state} dispatch={dispatch} />
    </div>
  );
};

export default BookingComponentDesktop;
