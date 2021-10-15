import { Dispatch, SetStateAction } from 'react';
import AvailabilitiesContainer from './AvailabilitiesContainer';
import CalendarComponent from './Caledar';
import EventInformations from './EventInformations';

type BookingComponentMobileType = {
  isBookSlotView: boolean;
  setIsBookSlotView: Dispatch<SetStateAction<boolean>>;
};

const BookingComponentMobile = ({
  isBookSlotView,
  setIsBookSlotView,
}: BookingComponentMobileType) => {
  return (
    <div>
      {isBookSlotView ? (
        <AvailabilitiesContainer setIsBookSlotView={setIsBookSlotView} />
      ) : (
        <div className="flex justify-center ">
          <div style={{ maxWidth: '600px' }}>
            <EventInformations />
            <CalendarComponent setIsBookSlotView={setIsBookSlotView} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingComponentMobile;
