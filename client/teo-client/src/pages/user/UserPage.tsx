import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import {
  GRID_ONE_COL,
  MEDIUM_MARGIN_BOTTOM,
  TITLE,
} from '../../shared/locales/constant';
import EventListener from '../../helpers/EventListener';
import { DATE_TO_CLIENT_FORMAT } from '../../shared/locales/utils';
import { BookingComponentType } from '../booking/BookingPageTypes';
import {
  SET_SPECIFIC_USER_BOOKINGS,
  timeRange,
} from '../booking/bookingReducer';
import { deleteBooking, retriveUserBooking } from './service/userService';
import { toast } from 'react-toastify';

const DeleteBooking = ({
  booking,
  setRender,
}: {
  booking: timeRange;
  setRender: Dispatch<SetStateAction<number>>;
}) => {
  const handleDelete = async () => {
    try {
      await deleteBooking(
        (response: any) => {
          console.log(response);
        },
        { start: booking.start, end: booking.end }
      );
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
      <GeneralButton buttonText="cancella" onClick={handleDelete} />
    </div>
  );
};

const UserPage = ({ dispatch, state }: BookingComponentType) => {
  const [forceRender, setRender] = useState(0);

  useEffect(() => {}, [forceRender]);
  useEffect(() => {
    const handleReceiveBooking = (booking: any) => {
      dispatch({ type: SET_SPECIFIC_USER_BOOKINGS, payload: booking });
    };
    const asyncFunc = async () => {
      try {
        const password = localStorage.getItem('token');
        if (password) {
          await retriveUserBooking(handleReceiveBooking);
        }
      } catch (e: any) {
        EventListener.emit('errorHandling', e.response);
      }
    };
    asyncFunc();
  }, [dispatch, forceRender]);

  return (
    <div className={GRID_ONE_COL}>
      <p className={`${TITLE} ${MEDIUM_MARGIN_BOTTOM}`}>Le tue prenotazioni.</p>
      {state.schedules.specificUserBookings.length > 0 ? (
        <div>
          {state.schedules.specificUserBookings.map((book) => {
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
      {state.schedules.specificUserBookings.length === 0 ? (
        <div className="flex justify-center">
          <p>Non hai prenotazioni marcate.</p>
        </div>
      ) : null}
    </div>
  );
};

export default UserPage;
