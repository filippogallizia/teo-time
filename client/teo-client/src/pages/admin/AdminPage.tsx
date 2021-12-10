import React, { useEffect } from 'react';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { SET_BKGS_AND_USERS, SET_LOCATION } from '../booking/stateReducer';
import { getUsersAndBookings } from './service/AdminPageService';
import DetailedInfoBooking from './components/DetailedBookingInfo';
import { DateTime } from 'luxon';
import { MEDIUM_MARGIN_BOTTOM } from '../../shared/locales/constant';
import UsersTable from './components/UsersTable';
import { ProtectedRoute } from '../general/GeneralPage';
import { Redirect, Switch, useLocation } from 'react-router';
import Routes from '../../routes';
import { Link } from 'react-router-dom';
import AvalManager from './adminPages/availabilitiesManager/AvailabilitiesManager';
import { UserType } from '../../../types/Types';
import HolidaysManager from './adminPages/holidaysManager/HolidaysManager';
import CardComponent from './components/Card';
import i18n from '../../i18n';
import FixedBksManager from './adminPages/fixedBookingsManager/FixedBookingsManager';

export const AdminNav = () => {
  return (
    <div
      className={`flex-0 grid grid-flow-col row-span-3 place-items-center ${MEDIUM_MARGIN_BOTTOM}`}
    >
      <Link
        to={Routes.ADMIN_BOOKING_MANAGER}
        className="px-3 py-2 flex items-center  leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer ">
          {i18n.t('adminPage.nav.bookings')}
        </div>
      </Link>
      <Link
        to={Routes.ADMIN_USERS_TABLE}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.usersInfo')}
        </div>
      </Link>
      <Link
        to={Routes.ADMIN_AVAL_MANAGER}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.avalManage')}
        </div>
      </Link>
      <Link
        to={Routes.FIXED_BKS_MANAGER}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.fixedBksManage')}
        </div>
      </Link>
      <Link
        to={Routes.ADMIN_HOLIDAY_MANAGER}
        className="px-3 py-2 flex items-center leading-snug  border-b-4  border-transparent hover:border-yellow-500 "
      >
        <div className="font-serif cursor-pointer">
          {i18n.t('adminPage.nav.holidayManage')}
        </div>
      </Link>
    </div>
  );
};

const AdminPage = ({ dispatch, state }: BookingComponentType) => {
  let location = useLocation();

  useEffect(() => {
    dispatch({ type: SET_LOCATION, payload: { location: location.pathname } });
  }, [dispatch, location.pathname]);
  return (
    <div>
      <AdminNav />
      <div>
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
            <UsersTable />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.ADMIN_AVAL_MANAGER}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <AvalManager state={state} dispatch={dispatch} />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.ADMIN_HOLIDAY_MANAGER}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <HolidaysManager state={state} dispatch={dispatch} />
          </ProtectedRoute>
          <ProtectedRoute
            path={Routes.FIXED_BKS_MANAGER}
            condition={true}
            altRoute={Routes.ADMIN}
          >
            <FixedBksManager state={state} dispatch={dispatch} />
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
      </div>
    </div>
  );
};

const BookingManager = ({ dispatch, state }: BookingComponentType) => {
  useEffect(() => {
    const asynFn = async () => {
      try {
        const handleSuccess = (response: any) => {
          if (response && response.length > 0) {
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
              type: SET_BKGS_AND_USERS,
              payload: allBookingsParsedByDate,
            });
          } else {
            dispatch({
              type: SET_BKGS_AND_USERS,
              payload: [],
            });
          }
        };
        await getUsersAndBookings(handleSuccess);
      } catch (e) {
        console.log(e);
      }
    };
    asynFn();
  }, [dispatch, state.schedules.forceRender]);

  return (
    <div className="grid grid-flow-row gap-8 py-2 shadow-sm">
      {state.schedules.bookingsAndUsers.length > 0 &&
      Array.isArray(state.schedules.bookingsAndUsers) ? (
        state.schedules.bookingsAndUsers.map((booking, i: number) => {
          if (booking.length > 0) {
            return (
              <CardComponent key={i}>
                <DetailedInfoBooking
                  state={state}
                  dispatch={dispatch}
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

export default AdminPage;
