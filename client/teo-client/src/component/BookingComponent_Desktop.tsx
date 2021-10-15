import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import EventInformations from './EventInformations';

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

export default BookingComponentDesktop;
