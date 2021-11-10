import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import i18n from '../../i18n';
import { useHistory } from 'react-router-dom';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../shared/locales/constant';
import { BookingComponentType } from '../booking/BookingPageTypes';
import routes from '../../routes';
import InfoBooking from '../admin/components/InfoBooking';

const SuccessfulPage = ({ dispatch, state }: BookingComponentType) => {
  const history = useHistory();

  return (
    <div className="grid grid-cols-1 gap-6 justify-items-center">
      <div className={`${TITLE} text-center`}>
        <p>{i18n.t('succesfulPage.succesfullMessage')}</p>
      </div>
      <div>
        <InfoBooking
          date={state.schedules.selectedDate}
          hours={state.schedules.selectedHour}
        />
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
