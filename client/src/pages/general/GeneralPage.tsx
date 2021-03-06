import React from 'react';
import { Switch } from 'react-router';
import Routes from '../../routes';
import HomePage from '../home/HomePage';
import UserPage from '../user/UserPage';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import {
  SelfCenterLayout,
  SelfTopLayout,
} from '../../component/GeneralLayouts';
import BookingRouter from '../booking/BookingRouter';
import SessionService from '../../services/SessionService';
import AdminRouter from '../admin/adminPages/adminRouter/AdminRouter';

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

const GeneralPage = () => {
  const user = SessionService.getUser();
  const token = SessionService.getToken();

  return (
    <>
      <Switch>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING}
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <SelfTopLayout>
            <BookingRouter />
          </SelfTopLayout>
        </ProtectedRoute>

        <ProtectedRoute
          path={Routes.USER}
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SelfCenterLayout>
            <UserPage />
          </SelfCenterLayout>
        </ProtectedRoute>

        <ProtectedRoute
          path={Routes.ADMIN}
          condition={token && user && user.role === 'admin' ? true : false}
          altRoute={Routes.LOGIN}
        >
          <AdminRouter />
        </ProtectedRoute>

        <ProtectedRoute
          path={Routes.HOMEPAGE}
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <SelfCenterLayout>
            <HomePage />
          </SelfCenterLayout>
        </ProtectedRoute>
      </Switch>
    </>
  );
};

export default GeneralPage;
