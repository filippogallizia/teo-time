import React from 'react';
import GeneralButton from '../../component/GeneralButton';
import i18n from '../../i18n';
import { useHistory } from 'react-router-dom';
import { TITLE } from '../../shared/locales/constant';
import { BookingComponentType } from '../booking/BookingPageTypes';
import routes from '../../routes';
import InfoBooking from '../admin/components/InfoBooking';

const SuccessfulPage = ({ dispatch, state }: BookingComponentType) => {
  const history = useHistory();

  return (
    <div className="flex flex-col items-center gap-8 justify-center">
      <p className={TITLE}>{i18n.t('succesfulPage.succesfullMessage')}</p>
      <div className="grid grid-cols-1 gap-6 justify-items-start">
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
    </div>
  );
};

export default SuccessfulPage;
