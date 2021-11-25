import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import {
  EVENT_INFO_TEXT,
  ITALIC,
  MEDIUM_MARGIN_BOTTOM,
  SUB_TITLE,
  TITLE,
  USER_INFO,
} from '../../shared/locales/constant';
import { handleToastInFailRequest } from '../../shared/locales/utils';
import { DATE_TO_CLIENT_FORMAT } from '../../shared/locales/utils';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { SET_USER_BOOKINGS } from '../booking/stateReducer';
import { deleteBooking, retriveUserBooking } from './service/userService';
import { toast } from 'react-toastify';
import { TimeRangeType } from '../../../types/Types';
import i18n from '../../i18n';
import { SelfCenterLayout } from '../../component/GeneralLayouts';

const DeleteBooking = ({
  booking,
  setRender,
}: {
  booking: TimeRangeType;
  setRender: Dispatch<SetStateAction<number>>;
}) => {
  const handleDelete = async () => {
    try {
      await deleteBooking((response: any) => {}, {
        start: booking.start,
        end: booking.end,
      });
      setRender((prev) => prev + 1);
      toast.success('prenotazione cancellata', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className={`grid grid-cols-2 gap-4 justify-items-center items-center`}>
      <div className={EVENT_INFO_TEXT}>
        {DATE_TO_CLIENT_FORMAT(booking.start)}
      </div>
      <GeneralButton buttonText="Cancella" onClick={handleDelete} />
    </div>
  );
};

const UserPage = ({ dispatch, state }: BookingComponentType) => {
  const [forceRender, setRender] = useState(0);

  useEffect(() => {}, [forceRender]);
  useEffect(() => {
    const handleReceiveBooking = (booking: any) => {
      dispatch({ type: SET_USER_BOOKINGS, payload: booking });
    };
    const asyncFunc = async () => {
      try {
        await retriveUserBooking(handleReceiveBooking);
      } catch (e: any) {
        handleToastInFailRequest(e, toast);
      }
    };
    asyncFunc();
  }, [dispatch, forceRender]);

  const currentUser = localStorage.getItem(USER_INFO);
  //@ts-expect-error
  console.log(JSON.parse(currentUser).email.includes('gmail'), 'currnet');

  return (
    <div className="grid grid-cols-1 gap-8 justify-items-center">
      <div className="grid grid-cols-1">
        {currentUser && (
          <>
            <p className={`${TITLE} `}>
              {i18n.t('userPage.title', {
                name: JSON.parse(currentUser).name,
              })}
            </p>
          </>
        )}
      </div>
      <p className={`${SUB_TITLE} text-center`}>
        {i18n.t('userPage.body.subtitle')}
      </p>
      {state.schedules.userBookings.length > 0 ? (
        <div className="flex flex-col gap-8">
          {state.schedules.userBookings.map((book) => {
            return (
              <DeleteBooking
                setRender={setRender}
                key={book.start}
                booking={book}
              />
            );
          })}
        </div>
      ) : null}
      {state.schedules.userBookings.length === 0 ? (
        <div className="flex justify-center">
          <p>Non hai prenotazioni marcate.</p>
        </div>
      ) : null}
    </div>
  );
};

export default UserPage;
