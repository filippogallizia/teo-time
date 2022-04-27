import { Immutable } from 'immer';
import React, { createContext } from 'react';
import { initialState } from '../initialState';
import { Actions, InitialState } from '../bookingReducer';

export type DimensionsContextState = {
  dispatch: React.Dispatch<Actions>;
  state: InitialState;
};

export const initState = {
  dispatch: () => {},
  state: initialState,
};

export type Context = Immutable<DimensionsContextState>;

export const initialContext: Context = {
  ...initState,
};
//TODO CHECK THIS ANY
export const BookingContext = createContext<any>(initialContext);
