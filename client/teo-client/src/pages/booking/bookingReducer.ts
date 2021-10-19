import produce from 'immer';
import { DateTime } from 'luxon';
import { parseHoursToObject } from '../../helpers/helpers';
import { createBooking } from '../../service/calendar.service';

export const SET_AVAILABILITIES = 'SET_AVAILABILITIES';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';

type timeRange = { start: string; end: string };

export type InitialState = {
  schedules: {
    selectedDate: Date;
    selectedHour: string;
    availabilities: timeRange[];
  };
};

type ActionSetAvailabilities = {
  type: typeof SET_AVAILABILITIES;
  payload: timeRange[];
};

type ActionSetSelectionDate = {
  type: typeof SET_SELECTION_DATE;
  payload: Date;
};

type ActionSetSelectionHour = {
  type: typeof SET_SELECTION_HOUR;
  payload: string;
};

export type Actions =
  | ActionSetAvailabilities
  | ActionSetSelectionDate
  | ActionSetSelectionHour;

const bookingReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case SET_AVAILABILITIES:
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
    default:
      return initialState;
  }
};

export default bookingReducer;
