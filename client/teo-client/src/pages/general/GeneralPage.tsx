import React, { useContext } from 'react';
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
import { UserContext } from '../../component/UserContext';

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

const GeneralPage = ({ dispatch, state }: BookingComponentType) => {
  const { user, token } = useContext(UserContext);

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
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SuccessfulPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.USER}
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <UserPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.CONFIRM_PAGE}
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <ConfirmPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.ADMIN}
          condition={token && user.role === 'admin' ? true : false}
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
