import React from 'react';
import GeneralButton from '../../component/GeneralButton';
import i18n from '../../i18n';
import { useHistory } from 'react-router-dom';
import { BOOKING_INFO, TITLE } from '../../constants/constant';
import routes from '../../routes';
import InfoBooking from '../admin/components/InfoBooking';
import LocalStorageManager from '../../services/StorageService';
import { HOUR_MINUTE_FORMAT } from '../../helpers/utils';

const SuccessfulPage = () => {
  const history = useHistory();
  const booking = LocalStorageManager.getItem(BOOKING_INFO) ?? '';
  const hours = HOUR_MINUTE_FORMAT(booking.start);
  const date = booking.start;

  return (
    <div className="flex flex-col gap-8 ">
      <p className={TITLE}>{i18n.t('succesfulPage.succesfullMessage')}</p>
      <div className="grid grid-cols-1 gap-8 justify-items-start">
        <div>
          <InfoBooking date={date} hours={hours} />
        </div>
        <GeneralButton
          buttonText={i18n.t('succesfulPage.backToBookingButton')}
          onClick={() => {
            history.push(routes.HOMEPAGE_BOOKING);
            LocalStorageManager.removeItem(BOOKING_INFO);
          }}
        />
      </div>
    </div>
  );
};

export default SuccessfulPage;
