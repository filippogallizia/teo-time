import React, { useEffect, useState } from 'react';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { SET_ALL_BOOKINGS_AND_USERS } from '../booking/bookingReducer';
import { getUsersAndBookings } from './service/AdminPageService';
import DetailedInfoBooking from './service/components/DetailedBookingInfo';
import { DateTime } from 'luxon';
import { DATE_TO_CLIENT_FORMAT } from '../../shared/locales/utils';
import { UserType } from '../../../../../types/Types';
import { BOLD, MEDIUM_MARGIN_BOTTOM } from '../../shared/locales/constant';
import UsersTable from './service/components/UsersTable';
import { ProtectedRoute } from '../general/GeneralPage';
import { Redirect, Switch } from 'react-router';
import Routes from '../../routes';
import { Link } from 'react-router-dom';

const AdminNav = () => {
  return (
    <div
      className={`grid grid-flow-col row-span-3 place-items-center ${MEDIUM_MARGIN_BOTTOM}`}
    >
      <Link
        to={Routes.ADMIN_BOOKING_MANAGER}
        className="px-3 py-2 flex items-center  leading-snug text-white border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer ">Prenotazioni</div>
      </Link>
      <Link
        to={Routes.ADMIN_USERS_TABLE}
        className="px-3 py-2 flex items-center leading-snug text-white border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">Disponibilita'</div>
      </Link>

      <div className="font-serif cursor-pointer">Altro</div>
    </div>
  );
};

const AdminPage = ({ dispatch, state }: BookingComponentType) => {
  return (
    <>
      <AdminNav />
      <Switch>
        <ProtectedRoute
          path={Routes.ADMIN_BOOKING_MANAGER}
          condition={true}
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <BookingManager state={state} dispatch={dispatch} />
        </ProtectedRoute>
      </Switch>
      <Switch>
        <ProtectedRoute
          path={Routes.ADMIN_USERS_TABLE}
          condition={true}
          altRoute={Routes.ADMIN}
        >
          <UsersTable state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.ADMIN}
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <Redirect
            to={{
              pathname: Routes.ADMIN_BOOKING_MANAGER,
            }}
          />
        </ProtectedRoute>
      </Switch>
    </>
  );
};

const BookingManager = ({ dispatch, state }: BookingComponentType) => {
  const [forceRender, setForceRender] = useState(0);
  useEffect(() => {
    const asynFn = async () => {
      try {
        const handleSuccess = (response: any) => {
          if (response) {
            const allBookingsParsedByDate: [
              {
                id: number;
                start: string;
                end: string;
                userId: number;
                user: UserType;
              }[]
            ] = response.reduce(
              (
                acc: any,
                cv: any
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
            dispatch({
              type: SET_ALL_BOOKINGS_AND_USERS,
              payload: allBookingsParsedByDate,
            });
          }
        };
        await getUsersAndBookings(handleSuccess);
      } catch (e) {
        console.log(e);
      }
    };
    asynFn();
  }, [dispatch, forceRender]);

  return (
    <div className="grid grid-flow-row gap-8  py-2 shadow-sm">
      {state.schedules.allBookingsAndUsers.map((booking, i: number) => {
        return (
          <div className="p-4 shadow-md">
            <p className={`${BOLD} ${MEDIUM_MARGIN_BOTTOM}`}>
              {DATE_TO_CLIENT_FORMAT(booking[0].start)}
            </p>
            <DetailedInfoBooking
              key={i}
              booking={booking}
              setForceRender={setForceRender}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AdminPage;
