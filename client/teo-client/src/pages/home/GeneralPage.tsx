import React, { useReducer } from 'react';
import { Switch } from 'react-router';
import { ProtectedRoute } from '../../App';
import BookingPage from '../booking/BookingPage';
import bookingReducer from '../booking/bookingReducer';
import SuccessfulPage from '../successfulSchedule/SuccesfulPage';
import Routes from '../../routes';
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

const HomePage = () => {
  return <p>WELCOM TO TEO-TIME</p>;
};

const GeneralPage = () => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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
          condition={true}
          altRoute={Routes.LOGIN}
        >
          <SuccessfulPage dispatch={dispatch} state={state} />
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
