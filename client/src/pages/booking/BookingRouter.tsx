import React, { useContext, useReducer } from 'react';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from '../general/GeneralPage';
import Routes from '../../routes';
import BookingPage from './BookingPage';
import SuccessfulPage from '../successfulBooking/SuccesfulPage';
import PaymentPage from '../payment/PaymentPage';
import ConfirmPage from '../confirm/ConfirmPage';
import { UserContext } from '../../component/UserContext';
import { ACCESS_TOKEN } from '../../shared/locales/constant';
import stateReducer from './stateReducer';
import { initialState } from './initialState';

const BookingRouter = () => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const { token } = useContext(UserContext);
  const tokenParam = new URLSearchParams(window.location.search).get('token');

  return (
    <div>
      <Switch>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING}
          condition={true}
          exact
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <BookingPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING_CONFIRM}
          condition={token || localStorage.getItem(ACCESS_TOKEN) ? true : false}
          altRoute={Routes.LOGIN}
        >
          <ConfirmPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING_SUCCESS}
          condition={token || tokenParam ? true : false}
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <SuccessfulPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
        <ProtectedRoute
          path={Routes.HOMEPAGE_BOOKING_PAYMENT}
          condition={true}
          altRoute={Routes.HOMEPAGE_BOOKING}
        >
          <PaymentPage dispatch={dispatch} state={state} />
        </ProtectedRoute>
      </Switch>
    </div>
  );
};

export default BookingRouter;