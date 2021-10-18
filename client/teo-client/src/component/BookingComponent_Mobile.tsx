import { useState } from 'react';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import EventInformations from './EventInformations';

const BookingComponentMobile = ({
  setSelectionHour,
  setSelectionDate,
  selectedDate,
}: BookingComponentType) => {
  const [renderAvailabilities, setRenderAvailabilities] = useState(false);

  return (
    <div>
      {renderAvailabilities ? (
        <AvailabilitiesContainer
          setRenderAvailabilities={setRenderAvailabilities}
          setSelectionHour={setSelectionHour}
        />
      ) : (
        <div className="flex justify-center ">
          <div style={{ maxWidth: '600px' }}>
            <EventInformations />
            <CalendarComponent
              setSelectionDate={setSelectionDate}
              selectedDate={selectedDate}
              setRenderAvailabilities={setRenderAvailabilities}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingComponentMobile;
