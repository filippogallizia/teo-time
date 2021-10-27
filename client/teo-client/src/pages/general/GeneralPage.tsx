import React, { useEffect, useReducer } from 'react';
import { Switch } from 'react-router';
import { ProtectedRoute } from '../../App';
import BookingPage from '../booking/BookingPage';
import bookingReducer from '../booking/bookingReducer';
import SuccessfulPage from '../successfulBooking/SuccesfulPage';
import Routes from '../../routes';
import { checkForOtp } from '../login/service/LoginService';
import { useLocation } from 'react-router-dom';
import HomePage from '../home/HomePage';
import EventListener from '../../helpers/EventListener';
import UserPage from '../user/UserPage';
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
    isConfirmPhase: false,
    isRenderAvailabilities: false,
    appointmentDetails: {
      id: 0,
      start: '',
    },
  },
};

const GeneralPage = () => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const search = useLocation().search;
  const otp = new URLSearchParams(search).get('otp');

  useEffect(() => {
    if (otp) {
      const asyncFetch = async () => {
        try {
          await checkForOtp((res: any) => console.log(res), otp);
          localStorage.setItem('token', otp);
        } catch (e: any) {
          EventListener.emit('errorHandling', e.response);
        }
      };
      asyncFetch();
    }
  }, [otp]);

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
