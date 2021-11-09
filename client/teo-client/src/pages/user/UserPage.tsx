import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import {
  GRID_ONE_COL,
  MEDIUM_MARGIN_BOTTOM,
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
    <div
      className={`grid grid-cols-2 gap-4 justify-items-center items-center ${MEDIUM_MARGIN_BOTTOM}`}
    >
      <div className="">{DATE_TO_CLIENT_FORMAT(booking.start)}</div>
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

  return (
    <div className={GRID_ONE_COL}>
      <div className="grid grid-flow-col gap-4 grid-cols-1 mb-10">
        {currentUser && (
          <>
            <div>{JSON.parse(currentUser).name}</div>
            <div>{JSON.parse(currentUser).email}</div>
          </>
        )}
      </div>
      <p className={`${TITLE} ${MEDIUM_MARGIN_BOTTOM}`}>Le tue prenotazioni.</p>
      {state.schedules.userBookings.length > 0 ? (
        <div>
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
