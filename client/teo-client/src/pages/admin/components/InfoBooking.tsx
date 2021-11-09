import { DateTime } from 'luxon';
import i18n from '../../../i18n';
import { BOLD, MARGIN_BOTTOM, TITLE } from '../../../shared/locales/constant';

type InfoBookingType = {
  date: string;
  hours: string;
};

const InfoBooking = ({ date, hours }: InfoBookingType) => {
  return (
    <div className={MARGIN_BOTTOM}>
      <div className={TITLE}>
        {i18n.t('confirmPage.date')}
        <span className={`${BOLD} ml-2`}>
          {`${DateTime.fromISO(date).toFormat('yyyy LLL  dd')}`}
        </span>
      </div>
      <div className={TITLE}>
        Ore:
        <span className={`${BOLD} ml-2`}>{` ${hours}`}</span>
      </div>
    </div>
  );
};

export default InfoBooking;
