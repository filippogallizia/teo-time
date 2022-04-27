import React, { useState } from 'react';
import { useBookingContext } from '../../context/useBookingContext';
import AvalContainer from '../AvailabilitiesContainer';
import CalendarComponent from '../Caledar';
import EventInformations from '../EventInformations';

export enum BookingPhase {
  VIEW_CALENDAR,
  VIEW_AVAIL,
  CONFIRM_BOOKING,
}

const MobileBkgVersion = () => {
  const [bookingPhase, setBookingPhase] = useState<BookingPhase>(
    BookingPhase.VIEW_CALENDAR
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
          <EventInformations
            bookingPhase={bookingPhase}
            setBookingPhase={setBookingPhase}
          />
        </div>
        <div className="col-span-4">
          {bookingPhase === BookingPhase.VIEW_AVAIL && (
            <div>
              <AvalContainer />
            </div>
          )}

          {bookingPhase === BookingPhase.VIEW_CALENDAR && (
            <div className="flex justify-center">
              <div style={{ maxWidth: '600px' }}>
                <CalendarComponent setBookingPhase={setBookingPhase} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileBkgVersion;
