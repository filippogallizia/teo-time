// external libraries
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import Routes from '../routes';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
  useLocation,
} from 'react-router-dom';

// local files
import Navbar from './NavBar';
import GeneralPage from '../pages/general/GeneralPage';
import Login, { ForgotPassword } from '../pages/login-signup-resetPass/Login';
import Signup from '../pages/login-signup-resetPass/Signup';
import Footer from './Footer';
import stateReducer from '../pages/booking/stateReducer';
import { ACCESS_TOKEN, USER_INFO } from '../shared/locales/constant';
import ResetPassword from '../pages/login-signup-resetPass/ResetPassword';
import { UserContext } from './UserContext';
import ContactPage from '../pages/contact/ContactPage';
import { AdminNav } from '../pages/admin/AdminPage';

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

const startingAval = new Date();
startingAval.setHours(7, 0, 0, 0);

const endAval = new Date();
endAval.setHours(20, 30, 0, 0);

const initialState = {
  schedules: {
    selectedDate: today.toISOString(),
    selectedHour: '00:00',
    availabilities: [
      {
        start: startingAval.toISOString(),
        end: endAval.toISOString(),
      },
    ],
    userBookings: [],
    isConfirmPhase: false,
    isRenderAval: false,
    currentUser: {},
    bookingsAndUsers: [],
    weekAvalSettings: [
      {
        day: 'Monday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Tuesday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Wednesday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Thursday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Friday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
    ],
    forceRender: 0,
    holidays: [],
    location: '',
  },
};

const MainContentWrapper = (props: any) => {
  return (
    <div className="flex-1 flex flex-col justify-center p-2">
      {props.children}
    </div>
  );
};

const RouterComponent = (): JSX.Element => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo(
    () => ({ user, setUser, token, setToken }),
    [user, setUser, token, setToken]
  );

  useEffect(() => {
    const userInfo = localStorage.getItem(USER_INFO);
    const TOKEN = localStorage.getItem(ACCESS_TOKEN);
    if (TOKEN) {
      setToken(TOKEN);
    }
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, [setUser]);

  return (
    <Router>
      <UserContext.Provider value={value}>
        <Navbar dispatch={dispatch} state={state} />
        {state.schedules.location.includes('admin') && <AdminNav />}
        <MainContentWrapper>
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
              path={Routes.CONTACT}
              condition={true}
              altRoute={Routes.ROOT}
            >
              <ContactPage />
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
        </MainContentWrapper>
        <Footer />
      </UserContext.Provider>
    </Router>
  );
};

export default RouterComponent;
