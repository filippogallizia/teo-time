import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
import { BookingComponentType } from '../booking/BookingPageTypes';

const SuccessfulPage = ({ dispatch, state }: BookingComponentType) => {
  const [appointmentDetails, setDetails] = useState<string | null>('');
  useEffect(() => {
    const details = localStorage.getItem('APPOINTMENT_DETAILS');
    setDetails(details);
  }, []);

  const parsedData =
    appointmentDetails &&
    DateTime.fromISO(appointmentDetails).toFormat('yyyy LLL dd t');

  return (
    <div className="grid grid-cols-1 gap-8 justify-items-center">
      <div className={`${TITLE} text-center ${MARGIN_BOTTOM}`}>
        Appuntamento registrato con successo
      </div>
      <div>
        <p className={TITLE}>
          {`DATA:  `} <span className="text-green-500">{parsedData}</span>
        </p>
      </div>
    </div>
  );
};

export default SuccessfulPage;
