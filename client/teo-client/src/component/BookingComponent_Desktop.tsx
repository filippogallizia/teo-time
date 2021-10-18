import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import EventInformations from './EventInformations';

const BookingComponentDesktop = ({
  setSelectionHour,
  setSelectionDate,
  selectedDate,
}: BookingComponentType) => {
  return (
    <div className="flex justify-center ">
      <EventInformations />
      <div className="flex justify-center ">
        <div style={{ maxWidth: '600px' }}>
          <CalendarComponent
            setSelectionDate={setSelectionDate}
            selectedDate={selectedDate}
          />
        </div>
      </div>
      <AvailabilitiesContainer setSelectionHour={setSelectionHour} />
    </div>
  );
};

export default BookingComponentDesktop;
