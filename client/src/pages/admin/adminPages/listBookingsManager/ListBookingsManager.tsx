import React, { useEffect, useState } from 'react';
import AdminPageApi from './ListBookingsManagerApi';
import DetailedInfoBooking from '../../components/DetailedBookingInfo';
import { UserType } from '../../../../../types/Types';
import CardComponent from '../../components/Card';
import i18n from '../../../../i18n';
import FixedBookingsManagerApi from '../fixedBookingsManager/FixedBookingsManagerApi';
import { mapFixedBookings } from './helpers/helpers';

export type BookingsAndUsersType = {
  id: number;
  start: string;
  end: string;
  userId: number;
  user: UserType;
}[];

const ListBookingsManager = () => {
  const [bookings, setBookings] = useState<BookingsAndUsersType>([]);

  const fetchAndSetBookings = async () => {
    try {
      const handleSuccess = (response: any) => {
        if (response && response.length > 0) {
          setBookings(response);
        } else {
          setBookings([]);
        }
      };
      const bookingResponse = await AdminPageApi.getUsersAndBookings();
      const fixedBookingResponse =
        await FixedBookingsManagerApi.getFixedBookings('start');

      const mappedFixedBooking = mapFixedBookings(fixedBookingResponse);

      const allBookings = [...bookingResponse, ...mappedFixedBooking].sort(
        //@ts-expect-error
        (item1, item2) => item1.start > item2.start
      );
      handleSuccess(allBookings);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAndSetBookings();
  }, []);

  return (
    <div className="grid grid-flow-row gap-8 py-2 shadow-sm">
      {bookings.length > 0 && Array.isArray(bookings) ? (
        bookings.map((booking, i: number) => {
          if (booking) {
            return (
              <CardComponent key={i}>
                <DetailedInfoBooking
                  fetchAndSetBookings={fetchAndSetBookings}
                  key={i}
                  booking={booking}
                />
              </CardComponent>
            );
          } else return [];
        })
      ) : (
        <div className="flex justify-center ">
          <div>{i18n.t('adminPage.noBookings')}</div>
        </div>
      )}
    </div>
  );
};

export default ListBookingsManager;
