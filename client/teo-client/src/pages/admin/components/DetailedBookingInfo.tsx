import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import i18n from '../../../i18n';
import {
  BOLD,
  EVENT_INFO_TEXT,
  MEDIUM_MARGIN_BOTTOM,
  SECONDARY_BUTTON,
  SECONDARY_LINK,
} from '../../../shared/locales/constant';
import { HOUR_MINUTE_FORMAT } from '../../../shared/locales/utils';
import { BookingComponentType } from '../../booking/BookingPageTypes';
import { BookingAndUser, FORCE_RENDER } from '../../booking/stateReducer';
import { deleteBooking } from '../../user/service/userService';

const EditBooking = ({
  oneBooking,
  dispatch,
  state,
}: {
  oneBooking: AllBookingInfo;
} & BookingComponentType) => {
  const handleDelete = async () => {
    try {
      await deleteBooking((response: any) => {}, {
        start: oneBooking.start,
        end: oneBooking.end,
      });
      dispatch({
        type: FORCE_RENDER,
        payload: state.schedules.forceRender + 1,
      });
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
  dispatch,
  state,
}: {
  booking: BookingAndUser[];
} & BookingComponentType) => {
  const [allBookingInfo, setAllBookingInfo] = useState<Array<AllBookingInfo>>(
    []
  );

  useEffect(() => {
    if (booking.length) {
      const addOpenProp = booking.map((a: any) => {
        return {
          ...a,
          open: false,
        };
      });
      setAllBookingInfo(addOpenProp);
    }
    return () => {
      setAllBookingInfo([]);
    };
  }, [booking]);

  return (
    <div>
      {allBookingInfo.length > 0 &&
        allBookingInfo.map((l: BookingAndUser, i: number) => {
          const { start, user } = l;
          if (!user) return <p>{i18n.t('general.somethingWentWrong')}</p>;
          else {
            return (
              <div
                key={start}
                className={`grid grid-cols-5 gap-4 ${MEDIUM_MARGIN_BOTTOM}`}
              >
                <div className="col-span-2 grid grid-cols-1 gap-4 content-start ">
                  <p className={`${BOLD}`}>
                    {booking[0].start &&
                      DateTime.fromISO(booking[0].start).toFormat(
                        'yyyy LLL dd '
                      )}
                  </p>
                  <div className="grid grid-cols-2 gap-0 items-center">
                    <div className="rounded-full h-7 w-7 bg-yellow-500"></div>
                    <p>{`${HOUR_MINUTE_FORMAT(start)} h`}</p>
                  </div>
                  {allBookingInfo[i].open && (
                    <EditBooking
                      state={state}
                      dispatch={dispatch}
                      oneBooking={allBookingInfo[i]}
                    />
                  )}
                </div>
                <div className="col-span-2 grid grid-cols-1 gap-4">
                  <div>
                    <p>{user.name}</p>
                  </div>
                  {allBookingInfo[i].open && (
                    <>
                      <div>
                        <p className={EVENT_INFO_TEXT}>
                          {i18n.t('form.email')}
                        </p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className={EVENT_INFO_TEXT}>
                          {i18n.t('form.address')}
                        </p>
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
                    setAllBookingInfo((prev: any) => {
                      const mutation = [...prev];
                      mutation[i] = {
                        ...mutation[i],
                        open: !mutation[i].open,
                      };
                      return mutation;
                    });
                  }}
                >
                  {i18n.t('adminPage.bookingManagerPage.detailsButton')}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};
export default DetailedInfoBooking;
