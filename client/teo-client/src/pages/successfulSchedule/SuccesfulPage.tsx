import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MARGIN_BOTTOM, TITLE } from '../../constant';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { checkForOtp } from '../login/service/LoginService';

const SuccessfulPage = ({ dispatch, state }: BookingComponentType) => {
  const [appointmentDetails, setDetails] = useState<string | null>('');
  useEffect(() => {
    const details = localStorage.getItem('APPOINTMENT_DETAILS');
    setDetails(details);
  }, []);
  const [isAValidUser, setValidUser] = useState(false);
  const search = useLocation().search;
  const otp = new URLSearchParams(search).get('otp');

  useEffect(() => {
    if (otp) {
      const asyncFetch = async () => {
        try {
          await checkForOtp((res: any) => console.log(res), otp);
          setValidUser(true);
        } catch {
          setValidUser(false);
        }
      };
      asyncFetch();
    }
  }, [otp]);

  const parsedData =
    appointmentDetails &&
    DateTime.fromISO(appointmentDetails).toFormat('yyyy LLL dd t');
  if (isAValidUser) {
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
  } else {
    return <p>Non autorizzato</p>;
  }
};

export default SuccessfulPage;
