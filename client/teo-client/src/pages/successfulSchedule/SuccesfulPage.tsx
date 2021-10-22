import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { MARGIN_BOTTOM, TITLE } from '../../constant';

const SuccessfulPage = () => {
  const [appointmentDetails, setDetails] = useState<string | null>('');
  useEffect(() => {
    const details = localStorage.getItem('APPOINTMENT_DETAILS');
    setDetails(details);
  }, []);
  const parsedData =
    appointmentDetails &&
    DateTime.fromISO(appointmentDetails).toFormat('yyyy LLL dd t');

  console.log(parsedData, 'parsedData');
  return (
    <div className="flex flex-col justify-center items-center h-screen">
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