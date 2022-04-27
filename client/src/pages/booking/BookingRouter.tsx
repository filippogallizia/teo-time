import React, { useReducer } from 'react';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from '../general/GeneralPage';
import Routes from '../../routes';
import BookingPage from './BookingPage';
import SuccessfulPage from '../successfulBooking/SuccesfulPage';
import PaymentPage from '../payment/PaymentPage';
import ConfirmPage from '../confirm/ConfirmPage';
import { ACCESS_TOKEN } from '../../constants/constant';
import bookingReducer from './bookingReducer';
import { initialState } from './initialState';
import SessionService from '../../services/SessionService';
import { BookingContext } from './context/BookingContext';

const BookingRouter = () => {
  const [bookingState, bookingDispatcher] = useReducer(
    bookingReducer,
    initialState
  );
  const tokenParam = new URLSearchParams(window.location.search).get('token');

  const token = SessionService.getToken();

  return (
    <BookingContext.Provider
      value={{ state: bookingState, dispatch: bookingDispatcher }}
    >
      <Switch>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING}
          condition={true}
          exact
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <BookingPage />
        </ProtectedRoute>

        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING_CONFIRM}
          condition={token || localStorage.getItem(ACCESS_TOKEN) ? true : false}
          altRoute={Routes.LOGIN}
        >
          <ConfirmPage />
        </ProtectedRoute>

        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING_SUCCESS}
          condition={token || tokenParam ? true : false}
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <SuccessfulPage />
        </ProtectedRoute>

        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING_PAYMENT}
          condition={true}
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <PaymentPage />
        </ProtectedRoute>
      </Switch>
    </BookingContext.Provider>
  );
};

export default BookingRouter;
