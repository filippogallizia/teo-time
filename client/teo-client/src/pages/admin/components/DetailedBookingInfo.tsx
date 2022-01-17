import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BookingAndUser, UserType } from '../../../../types/Types';
import i18n from '../../../i18n';
import {
  BOLD,
  EVENT_INFO_TEXT,
  MEDIUM_MARGIN_BOTTOM,
  SECONDARY_BUTTON,
  SECONDARY_LINK,
} from '../../../shared/locales/constant';
import { HOUR_MINUTE_FORMAT } from '../../../shared/locales/utils';
import { deleteBooking } from '../../user/service/userService';

const EditBooking = ({
  oneBooking,
  fetchAndSetBookings,
}: {
  oneBooking: AllBookingInfo;
  fetchAndSetBookings: () => void;
}) => {
  const handleDelete = async () => {
    try {
      await deleteBooking((response: any) => {}, {
        start: oneBooking.start,
        end: oneBooking.end,
      });
      fetchAndSetBookings();
      toast.success('prenotazione cancellata', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-2 place-items-start">
      <div
        onClick={handleDelete}
        // className="flex justify-center items-center rounded-full p-2 bg-yellow-500  w-1/2"
        className={`${SECONDARY_BUTTON}`}
      >
        <p className="cursor-pointer self-auto">
          {i18n.t('adminPage.editBookingComponent.deleteButton')}
        </p>
      </div>
    </div>
  );
};

type AllBookingInfo = {
  open: boolean;
} & BookingAndUser;

const DetailedInfoBooking = ({
  booking,
  fetchAndSetBookings,
}: {
  booking: BookingAndUser;
  fetchAndSetBookings: () => void;
}) => {
  const [allBookingInfo, setAllBookingInfo] = useState<AllBookingInfo>();

  console.log(booking, 'bookingFilo');

  useEffect(() => {
    if (booking) {
      const addOpenProp = {
        ...booking,
        open: false,
      };
      setAllBookingInfo(addOpenProp);
    }
  }, [booking]);

  if (allBookingInfo) {
    const { user, start } = allBookingInfo;
    return (
      <div>
        {!user ? (
          <p>{i18n.t('general.somethingWentWrong')}</p>
        ) : (
          <div
            key={start}
            className={`grid grid-cols-5 gap-4 ${MEDIUM_MARGIN_BOTTOM}`}
          >
            <div className="col-span-2 grid grid-cols-1 gap-4 content-start ">
              <p className={`${BOLD}`}>
                {booking.start &&
                  DateTime.fromISO(booking.start).toFormat('yyyy LLL dd ')}
              </p>
              <div className="grid grid-cols-2 gap-0 items-center">
                <div className="rounded-full h-7 w-7 bg-yellow-500"></div>
                <p>{`${HOUR_MINUTE_FORMAT(start)} h`}</p>
              </div>
              {allBookingInfo.open && (
                <EditBooking
                  fetchAndSetBookings={fetchAndSetBookings}
                  oneBooking={allBookingInfo}
                />
              )}
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-4">
              <div>
                <p>{user.name}</p>
              </div>
              {allBookingInfo.open && (
                <>
                  <div>
                    <p className={EVENT_INFO_TEXT}>{i18n.t('form.email')}</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className={EVENT_INFO_TEXT}>{i18n.t('form.address')}</p>
                    <p>{i18n.t('form.city', { cityName: 'Milano' })}</p>
                  </div>
                  <div>
                    <p className={EVENT_INFO_TEXT}>
                      {i18n.t('form.phoneNumber')}
                    </p>
                    <p>{user.phoneNumber}</p>
                  </div>
                </>
              )}
            </div>
            <div
              className={`col-span-1 ${SECONDARY_LINK}`}
              onClick={() => {
                setAllBookingInfo((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      open: !prev?.open,
                    };
                  }
                });
              }}
            >
              {i18n.t('adminPage.bookingManagerPage.detailsButton')}
            </div>
          </div>
        )}
      </div>
    );
  } else return <p>cioa</p>;
};
export default DetailedInfoBooking;
