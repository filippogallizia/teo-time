import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import i18n from '../../i18n';
import { useHistory } from 'react-router-dom';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
import { BookingComponentType } from '../booking/BookingPageTypes';
import routes from '../../routes';

const SuccessfulPage = ({ dispatch, state }: BookingComponentType) => {
  const [appointmentDetails, setDetails] = useState<string | null>('');
  const history = useHistory();
  useEffect(() => {
    const details = localStorage.getItem('APPOINTMENT_DETAILS');
    setDetails(details);
  }, []);

  const parsedData =
    appointmentDetails &&
    DateTime.fromISO(appointmentDetails).toFormat('yyyy LLL dd - t');

  return (
    <div className="grid grid-cols-1 gap-8 justify-items-center">
      <div className={`${TITLE} text-center ${MARGIN_BOTTOM}`}>
        {i18n.t('succesfulPage.succesfullMessage')}
      </div>
      <div>
        <p className={TITLE}>
          <span>{i18n.t('succesfulPage.date')} </span>
          <span className={`${BOLD} ml-2`}>{parsedData}</span>
        </p>
      </div>
      <GeneralButton
        buttonText={i18n.t('succesfulPage.backToBookingButton')}
        onClick={() => {
          history.push(routes.HOMEPAGE_BOOKING);
        }}
      />
    </div>
  );
};

export default SuccessfulPage;
