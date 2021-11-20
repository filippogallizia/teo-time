import React, { useContext, useEffect } from 'react';
import { Switch } from 'react-router';
import BookingPage from '../booking/BookingPage';
import SuccessfulPage from '../successfulBooking/SuccesfulPage';
import Routes from '../../routes';
import HomePage from '../home/HomePage';
import UserPage from '../user/UserPage';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import ConfirmPage from '../confirm/ConfirmPage';
import AdminPage from '../admin/AdminPage';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { UserContext } from '../../component/UserContext';
import { SET_LOCATION } from '../booking/stateReducer';
import {
  SelfCenterLayout,
  SelfTopLayout,
} from '../../component/GeneralLayouts';

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
  let location = useLocation();

  useEffect(() => {
    dispatch({ type: SET_LOCATION, payload: { location: location.pathname } });
  }, [dispatch, location.pathname]);

  return (
    <>
      <Switch>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING}
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <SelfTopLayout>
            <BookingPage dispatch={dispatch} state={state} />
          </SelfTopLayout>
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE_SUCCESS}
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SelfCenterLayout>
            <SuccessfulPage dispatch={dispatch} state={state} />
          </SelfCenterLayout>
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.USER}
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SelfCenterLayout>
            <UserPage dispatch={dispatch} state={state} />
          </SelfCenterLayout>
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.CONFIRM_PAGE}
          condition={token ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SelfCenterLayout>
            <ConfirmPage dispatch={dispatch} state={state} />
          </SelfCenterLayout>
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.ADMIN}
          condition={token && user && user.role === 'admin' ? true : false}
          altRoute={Routes.LOGIN}
        >
          {/* <SelfTopLayout> */}
          <AdminPage dispatch={dispatch} state={state} />
          {/* </SelfTopLayout> */}
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
