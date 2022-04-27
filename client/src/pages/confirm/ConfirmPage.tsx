import { DateTime } from 'luxon';
import React from 'react';
import { BsFillArrowLeftSquareFill as GoBackArrow } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import GeneralButton from '../../component/GeneralButton';
import { BOOKING_INFO, TITLE } from '../../constants/constant';
import routes from '../../routes';
import { parseHoursToObject } from '../../helpers/utils';

import i18n from '../../i18n';
import InfoBooking from '../admin/components/InfoBooking';
import { HrsAndMinsType } from '../../../types/Types';
//import { googleCalendarInsertEvent } from '../auth/AuthApi/LoginService';
import BookingPageApi from '../booking/BookingPageApi';
import LocalStorageManager from '../../services/StorageService';
import ToastService from '../../services/ToastService';
import { useBookingContext } from '../booking/context/useBookingContext';

type InitialFormType = {
  name: string;
  email: string;
  phoneNumber: number;
};

//TODO change thisone
const EVENT_DURATION = { hours: 1, minutes: 0 };

const ConfirmPage = () => {
  const history = useHistory();
  const { state } = useBookingContext();

  const selectedDate = state.schedules.selectedDate;

  const mapped: HrsAndMinsType = parseHoursToObject(
    state.schedules.selectedHour
  );

  const parsedDate = DateTime.fromISO(selectedDate).set({
    hour: 0,
    minute: 0,
    millisecond: 0,
  });

  const booking = {
    start: parsedDate.plus(mapped).toISO(),
    end: parsedDate.plus(mapped).plus(EVENT_DURATION).toISO(),
  };

  const handleConfirmBooking = async (value: InitialFormType) => {
    try {
      await BookingPageApi.createBooking(booking);

      LocalStorageManager.setItem(BOOKING_INFO, booking);

      history.push(routes.HOMEPAGE_BOOKING_PAYMENT);
    } catch (e: any) {
      ToastService.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`justify-self-start cursor-pointer`}
        onClick={() => history.push(routes.HOMEPAGE_BOOKING)}
      >
        <GoBackArrow size="1.5em" color="#f59e0b" />
      </div>

      <div className={`${TITLE}`}>{i18n.t('confirmPage.confirmDatas')}</div>

      <InfoBooking />

      <div>
        <GeneralButton
          buttonText={i18n.t('confirmPage.bookButton')}
          onClick={handleConfirmBooking}
        />
      </div>
    </div>
  );
};

export default ConfirmPage;
