import produce from 'immer';
import { TimeRangeType } from '../../../types/Types';

export const SET_AVAL = 'SET_AVAL';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_AVAL_AND_SELECTION_DATE = 'SET_AVAL_AND_SELECTION_DATE';

export type InitialState = {
  schedules: {
    selectedDate: string;
    selectedHour: string;
    availabilities: TimeRangeType[];
  };
};

type ActionSetAval = {
  type: typeof SET_AVAL;
  payload: TimeRangeType[];
};

type ActionSetSelectionDate = {
  type: typeof SET_SELECTION_DATE;
  payload: string;
};

type ActionSetSelectionHour = {
  type: typeof SET_SELECTION_HOUR;
  payload: string;
};

type ActionSetAvalAndSelctedDay = {
  type: typeof SET_AVAL_AND_SELECTION_DATE;
  payload: {
    availabilities: TimeRangeType[];
    selectedDate: string;
  };
};

export type Actions =
  | ActionSetAval
  | ActionSetSelectionDate
  | ActionSetSelectionHour
  | ActionSetAvalAndSelctedDay;

const bookingReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case SET_AVAL:
      return produce(initialState, (draft) => {
        draft.schedules.availabilities = action.payload;
      });

    case SET_SELECTION_DATE:
      return produce(initialState, (draft) => {
        draft.schedules.selectedDate = action.payload;
      });

    case SET_SELECTION_HOUR:
      return produce(initialState, (draft) => {
        draft.schedules.selectedHour = action.payload;
      });

    case SET_AVAL_AND_SELECTION_DATE:
      return produce(initialState, (draft) => {
        draft.schedules.selectedDate = action.payload.selectedDate;
        draft.schedules.availabilities = action.payload.availabilities;
      });

    default:
      return initialState;
  }
};

export default bookingReducer;
