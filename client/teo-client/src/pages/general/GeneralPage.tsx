import React, { useReducer } from 'react';
import { Switch } from 'react-router';
import BookingPage from '../booking/BookingPage';
import bookingReducer from '../booking/bookingReducer';
import SuccessfulPage from '../successfulBooking/SuccesfulPage';
import Routes from '../../routes';
import HomePage from '../home/HomePage';
import UserPage from '../user/UserPage';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import ConfirmPage from '../confirm/ConfirmPage';
import AdminPage from '../admin/AdminPage';
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
    allBookingsAndUsers: [],
  },
};

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
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <>
      <Switch>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING}
          condition={localStorage.getItem('token') ? true : false}
          altRoute={Routes.LOGIN}
        >
          <BookingPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE_SUCCESS}
          condition={localStorage.getItem('token') ? true : false}
          altRoute={Routes.LOGIN}
        >
          <SuccessfulPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.USER}
          condition={localStorage.getItem('token') ? true : false}
          altRoute={Routes.LOGIN}
        >
          <UserPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.CONFIRM_PAGE}
          condition={localStorage.getItem('token') ? true : false}
          altRoute={Routes.LOGIN}
        >
          <ConfirmPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.ADMIN}
          condition={localStorage.getItem('token') ? true : false}
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
