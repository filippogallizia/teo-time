import { Dispatch } from 'react';
import { Actions, InitialState } from './bookingReducer';

export type BookingComponentType = {
  state: InitialState;
  dispatch: Dispatch<Actions>;
};
