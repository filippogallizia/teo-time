import { useEffect, useState } from 'react';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import EventInformations from './EventInformations';

const BookingComponentMobile = ({ dispatch, state }: BookingComponentType) => {
  const [renderAvailabilities, setRenderAvailabilities] = useState(false);

  useEffect(() => {}, [renderAvailabilities]);

  console.log(renderAvailabilities, 'renderAvailabilities');

  return (
    <div>
      {renderAvailabilities ? (
        <AvailabilitiesContainer
          dispatch={dispatch}
          state={state}
          setRenderAvailabilities={setRenderAvailabilities}
        />
      ) : (
        <div className="flex justify-center ">
          <div style={{ maxWidth: '600px' }}>
            <p>cioa</p>
            <EventInformations />
            <CalendarComponent
              setRenderAvailabilities={setRenderAvailabilities}
              state={state}
              dispatch={dispatch}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingComponentMobile;
