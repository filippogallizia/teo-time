import React, { useEffect, useState } from 'react';
import GeneralButton from '../../component/GeneralButton';
import {
  EVENT_INFO_TEXT,
  SUB_TITLE,
  TITLE,
  USER_INFO,
} from '../../shared/locales/constant';
import { handleToastInFailRequest } from '../../shared/locales/utils';
import { DATE_TO_CLIENT_FORMAT } from '../../shared/locales/utils';
import { deleteBooking, retriveUserBooking } from './service/userService';
import { toast } from 'react-toastify';
import { BookingAndUser, TimeRangeType } from '../../../types/Types';
import i18n from '../../i18n';

const DeleteBooking = ({
  booking,
  fetchAndSetBookings,
}: {
  booking: TimeRangeType;
  fetchAndSetBookings: () => void;
}) => {
  const handleDelete = async () => {
    try {
      await deleteBooking((response: any) => {}, {
        start: booking.start,
        end: booking.end,
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
    <div className={`grid grid-cols-2 gap-4 justify-items-center items-center`}>
      <div className={EVENT_INFO_TEXT}>
        {DATE_TO_CLIENT_FORMAT(booking.start)}
      </div>
      <GeneralButton buttonText="Cancella" onClick={handleDelete} />
    </div>
  );
};

const UserPage = () => {
  const [bookings, setBookings] = useState<BookingAndUser[]>([]);

  const fetchAndSetBookings = async () => {
    try {
      await retriveUserBooking(setBookings);
    } catch (error) {
      handleToastInFailRequest(error, toast);
    }
  };

  useEffect(() => {
    fetchAndSetBookings();
  }, []);

  const currentUser = localStorage.getItem(USER_INFO);

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
      {bookings.length > 0 ? (
        <div className="flex flex-col gap-8">
          {bookings.map((book) => {
            return (
              <DeleteBooking
                fetchAndSetBookings={fetchAndSetBookings}
                key={book.start}
                booking={book}
              />
            );
          })}
        </div>
      ) : null}
      {bookings.length === 0 ? (
        <div className="flex justify-center">
          <p>Non hai prenotazioni marcate.</p>
        </div>
      ) : null}
    </div>
  );
};

export default UserPage;