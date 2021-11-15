import { DateTime } from 'luxon';
import i18n from '../../../i18n';
import { BOLD, ITALIC, MARGIN_BOTTOM } from '../../../shared/locales/constant';

type InfoBookingType = {
  date: string;
  hours: string;
};

const InfoBooking = ({ date, hours }: InfoBookingType) => {
  return (
    <div className={`grid grid-cols-1 gap-4 ${MARGIN_BOTTOM}`}>
      <div className={`${ITALIC} text-lg`}>
        {i18n.t('confirmPage.date')}
        <span className={`${BOLD} ml-2`}>
          {`${DateTime.fromISO(date).toFormat('yyyy LLL  dd')}`}
        </span>
      </div>
      <div className={`${ITALIC} text-lg`}>
        Ore:
        <span className={`${BOLD} ml-2`}>{` ${hours}`}</span>
      </div>
      <div className={`${ITALIC} text-lg`}>
        Luogo:
        <span className={`${BOLD} ml-2`}>Via Osti</span>
      </div>
    </div>
  );
};

export default InfoBooking;
