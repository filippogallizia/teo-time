import React, { useRef } from 'react';
import { Switch } from 'react-router';
import BookingPage from '../booking/BookingPage';
import SuccessfulPage from '../successfulBooking/SuccesfulPage';
import Routes from '../../routes';
import HomePage from '../home/HomePage';
import UserPage from '../user/UserPage';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import ConfirmPage from '../confirm/ConfirmPage';
import AdminPage from '../admin/AdminPage';
import { BookingComponentType } from '../booking/BookingPageTypes';
import {
  ACCESS_TOKEN,
  CURRENT_USER_ROLE,
  USER_INFO,
} from '../../shared/locales/constant';

type ProtectedRouteType = {
  children: any;
  condition: boolean;
  altRoute: string;
} & RouteProps;

export const ProtectedRoute = ({
  children,
  condition,
  altRoute,
  ...props
}: ProtectedRouteType) => {
  if (condition) {
    return <Route {...props}>{children}</Route>;
  }
  return (
    <Redirect
      to={{
        pathname: altRoute,
      }}
    />
  );
};

const userInfo = localStorage.getItem(USER_INFO);

export const IS_ADMIN = userInfo
  ? JSON.parse(userInfo).role === 'admin'
  : false;

export const TOKEN = localStorage.getItem(ACCESS_TOKEN);

const GeneralPage = ({ dispatch, state }: BookingComponentType) => {
  return (
    <>
      <Switch>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING}
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <BookingPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE_SUCCESS}
          condition={TOKEN ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SuccessfulPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.USER}
          condition={TOKEN ? true : false}
          altRoute={Routes.LOGIN}
        >
          <UserPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.CONFIRM_PAGE}
          condition={TOKEN ? true : false}
          altRoute={Routes.LOGIN}
        >
          <ConfirmPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.ADMIN}
          condition={TOKEN && IS_ADMIN ? true : false}
          altRoute={Routes.LOGIN}
        >
          <AdminPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE}
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <HomePage />
        </ProtectedRoute>
      </Switch>
    </>
  );
};

export default GeneralPage;
