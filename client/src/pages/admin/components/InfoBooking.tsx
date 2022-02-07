import { DateTime } from 'luxon';
import i18n from '../../../i18n';
import { BOOKING_INFO, EVENT_INFO_TEXT } from '../../../constants/constant';
import LocalStorageManager from '../../../services/StorageService';

type InfoBookingType = {
  date: string;
  hours: string;
};

const InfoBooking = ({ date, hours }: InfoBookingType) => {
  const booking = LocalStorageManager.getItem(BOOKING_INFO);

  console.log(booking, 'booking');

  return (
    <div className={`grid grid-cols-1 gap-4`}>
      <div className={`${EVENT_INFO_TEXT}`}>
        {i18n.t('confirmPage.date')}
        <span className={`ml-2`}>
          {`${DateTime.fromISO(booking.start).toFormat('yyyy LLL  dd')}`}
        </span>
      </div>
      <div className={`${EVENT_INFO_TEXT}`}>
        Ore:
        <span className={`ml-2`}>{` ${hours}`}</span>
      </div>
      <div className={`${EVENT_INFO_TEXT}`}>
        Luogo:
        <span className={`ml-2`}>Via Osti</span>
      </div>
      <div className={`${EVENT_INFO_TEXT}`}>
        Prezzo:
        <span className={`ml-2`}>50 Euro</span>
      </div>
    </div>
  );
};

export default InfoBooking;
