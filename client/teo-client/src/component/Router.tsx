// external libraries
import React, { useEffect, useReducer, useState } from 'react';
import Routes from '../routes';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';

// local files
import Navbar from './NavBar';
import GeneralPage from '../pages/general/GeneralPage';
import Login, { ForgotPassword } from '../pages/login-signup-resetPass/Login';
import Signup from '../pages/login-signup-resetPass/Signup';
import Footer from './Footer';
import bookingReducer from '../pages/booking/bookingReducer';
import { ACCESS_TOKEN } from '../shared/locales/constant';
import ResetPassword from '../pages/login-signup-resetPass/ResetPassword';

const GeneralLayout = ({ children }: { children: JSX.Element }) => {
  return <div className="flex flex-col md:m-auto md:max-w-2xl">{children}</div>;
};

type ProtectedRouteType = {
  children: JSX.Element;
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

const today = new Date();
today.setHours(0, 0, 0, 0);

const startingAvailabilities = new Date();
startingAvailabilities.setHours(7, 0, 0, 0);

const endAvailabilities = new Date();
endAvailabilities.setHours(20, 30, 0, 0);

const initialState = {
  schedules: {
    selectedDate: today.toISOString(),
    selectedHour: '00:00',
    availabilities: [
      {
        start: startingAvailabilities.toISOString(),
        end: endAvailabilities.toISOString(),
      },
    ],
    specificUserBookings: [],
    isConfirmPhase: false,
    isRenderAvailabilities: false,
    appointmentDetails: {
      id: 0,
      start: '',
    },
    currentUser: {},
    allBookingsAndUsers: [],
  },
};

const RouterComponent = (): JSX.Element => {
  const [, setToken] = useState<string | null>('');
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  useEffect(() => {
    setToken(() => localStorage.getItem(ACCESS_TOKEN));
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen">
        <div className="pb-16">
          <Navbar setToken={setToken} />

          <Switch>
            <ProtectedRoute
              path={Routes.LOGIN}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <Login dispatch={dispatch} state={state} />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.RESET_PASSWORD}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ResetPassword dispatch={dispatch} state={state} />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.LOGIN_FORGOT_PASSWORD}
              condition={true}
              altRoute={Routes.LOGIN}
            >
              <ForgotPassword />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.SIGNUP}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <Signup />
            </ProtectedRoute>

            <ProtectedRoute
              path={Routes.HOMEPAGE}
              condition={true}
              altRoute={Routes.LOGIN}
            >
              <GeneralLayout>
                <GeneralPage dispatch={dispatch} state={state} />
              </GeneralLayout>
            </ProtectedRoute>
            <ProtectedRoute
              path={Routes.ROOT}
              condition={true}
              altRoute={Routes.LOGIN}
            >
              <Redirect
                to={{
                  pathname: Routes.HOMEPAGE,
                }}
              />
            </ProtectedRoute>
          </Switch>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default RouterComponent;
