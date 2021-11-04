import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import i18n from '../../i18n';
import { useHistory } from 'react-router-dom';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
import { BookingComponentType } from '../booking/BookingPageTypes';
import routes from '../../routes';

const SuccessfulPage = ({ dispatch, state }: BookingComponentType) => {
  const history = useHistory();

  const parsedData = DateTime.fromISO(
    state.schedules.appointmentDetails.start
  ).toFormat('yyyy LLL dd - t');

  return (
    <div className="grid grid-cols-1 gap-8 justify-items-center">
      <div className={`${TITLE} text-center ${MARGIN_BOTTOM}`}>
        {i18n.t('succesfulPage.succesfullMessage')}
      </div>
      <div>
        <div className={TITLE}>
          {i18n.t('succesfulPage.date')}
          <span className={`${BOLD} ml-2`}>{parsedData}</span>
        </div>
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
