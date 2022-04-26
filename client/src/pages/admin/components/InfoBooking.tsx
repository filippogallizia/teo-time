import { DateTime } from 'luxon';
import i18n from '../../../i18n';
import { EVENT_INFO_TEXT } from '../../../constants/constant';

type InfoBookingType = {
  date: string;
  hours: string;
};

const InfoBooking = ({ date, hours }: InfoBookingType) => {
  return (
    <div className={`grid grid-cols-1 gap-4`}>
      <div className={`${EVENT_INFO_TEXT}`}>
        {i18n.t('confirmPage.date')}
        <span className={`ml-2`}>
          {`${DateTime.fromISO(date).toFormat('yyyy LLL  dd')}`}
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
