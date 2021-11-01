import React, { useEffect } from 'react';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { SET_ALL_BOOKINGS_AND_USERS } from '../booking/bookingReducer';
import { getUsersAndBookings } from './service/AdminPageService';
import TableComponent from './service/components/UserTable';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { DATE_TO_CLIENT_FORMAT } from '../../shared/locales/utils';
import { UserType } from '../../../../../types/Types';
import { BOLD, MEDIUM_MARGIN_BOTTOM } from '../../shared/locales/constant';

const AdminNav = () => {
  return (
    <div
      className={`grid grid-flow-col row-span-3 place-items-center ${MEDIUM_MARGIN_BOTTOM}`}
    >
      <div className="font-serif">Prenotazioni</div>
      <div className="font-serif">Disponibilita'</div>
      <div className="font-serif">Altro</div>
    </div>
  );
};

const AdminPage = ({ dispatch, state }: BookingComponentType) => {
  useEffect(() => {
    const asynFn = async () => {
      try {
        const handleSuccess = (response: any) => {
          if (response) {
            dispatch({
              type: SET_ALL_BOOKINGS_AND_USERS,
              payload: response,
            });
          }
        };
        await getUsersAndBookings(handleSuccess);
      } catch (e) {
        console.log(e);
      }
    };
    asynFn();
  }, [dispatch]);

  const prova: [
    {
      id: number;
      start: string;
      end: string;
      userId: number;
      user: UserType;
    }[]
  ] = state.schedules.allBookingsAndUsers.reduce(
    (
      acc: any,
      cv
    ): [
      {
        id: number;
        start: string;
        end: string;
        userId: number;
        user: UserType;
      }[]
    ] => {
      if (acc.length === 0) {
        acc.push([cv]);
      }
      const lastOne = acc[acc.length - 1];
      if (
        DateTime.fromISO(lastOne[lastOne.length - 1].start).day ===
          DateTime.fromISO(cv.start).day &&
        lastOne[lastOne.length - 1].start !== cv.start
      ) {
        lastOne.push(cv);
      }
      if (
        DateTime.fromISO(lastOne[lastOne.length - 1].start).day !==
        DateTime.fromISO(cv.start).day
      ) {
        acc.push([cv]);
      }
      return acc;
    },
    []
  );

  return (
    <>
      <AdminNav />
      <div className="grid grid-flow-row gap-8  py-2 shadow-sm">
        {prova.map((booking, i: number) => {
          return (
            <div className="p-4 shadow-md">
              <p className={`${BOLD} ${MEDIUM_MARGIN_BOTTOM}`}>
                {DATE_TO_CLIENT_FORMAT(booking[0].start)}
              </p>
              <TableComponent key={i} dispatch={dispatch} booking={booking} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AdminPage;