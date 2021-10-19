import { Dispatch, SetStateAction } from 'react';
import { Actions, InitialState } from './bookingReducer';

export type BookingComponentType = {
  state: InitialState;
  dispatch: Dispatch<Actions>;
};

export type CalendarComponentType = {
  setRenderAvailabilities?: Dispatch<SetStateAction<boolean>>;
  state: InitialState;
  dispatch: Dispatch<Actions>;
};
