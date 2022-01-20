import { Dispatch } from 'react';
import { Actions, InitialState } from './stateReducer';

export type BookingComponentType = {
  state: InitialState;
  dispatch: Dispatch<Actions>;
};
