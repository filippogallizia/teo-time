import React, { useContext, useEffect, useReducer } from 'react';
import { Switch } from 'react-router';
import Routes from '../../routes';
import HomePage from '../home/HomePage';
import UserPage from '../user/UserPage';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import AdminPage from '../admin/AdminPage';
import { UserContext } from '../../component/UserContext';
import stateReducer, { SET_LOCATION } from '../booking/stateReducer';
import {
  SelfCenterLayout,
  SelfTopLayout,
} from '../../component/GeneralLayouts';
import BookingRouter from '../booking/BookingRouter';
import { initialState } from '../booking/initialState';

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
  const { user, token } = useContext(UserContext);
  const [state, dispatch] = useReducer(stateReducer, initialState);
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
            <BookingRouter dispatch={dispatch} state={state} />
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
          <AdminPage dispatch={dispatch} state={state} />
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
