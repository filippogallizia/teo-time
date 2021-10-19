import produce from 'immer';
import { DateTime } from 'luxon';
import { parseHoursToObject } from '../../helpers/helpers';
import { createBooking } from '../../service/calendar.service';

export const SET_AVAILABILITIES = 'SET_AVAILABILITIES';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAILABILITIES = 'SET_RENDER_AVAILABILITIES';

type timeRange = { start: string; end: string };

export type InitialState = {
  schedules: {
    selectedDate: Date;
    selectedHour: string;
    availabilities: timeRange[];
    isConfirmPhase: boolean;
    isRenderAvailabilities: boolean;
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

type ActionSetConfirmPhase = {
  type: typeof SET_CONFIRM_PHASE;
  payload: boolean;
};
type ActionSetRenderAvailabilities = {
  type: typeof SET_RENDER_AVAILABILITIES;
  payload: boolean;
};

export type Actions =
  | ActionSetAvailabilities
  | ActionSetSelectionDate
  | ActionSetSelectionHour
  | ActionSetConfirmPhase
  | ActionSetRenderAvailabilities;

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
    case SET_CONFIRM_PHASE:
      return produce(initialState, (draft) => {
        draft.schedules.isConfirmPhase = action.payload;
      });
    case SET_RENDER_AVAILABILITIES:
      return produce(initialState, (draft) => {
        draft.schedules.isRenderAvailabilities = action.payload;
      });
    default:
      return initialState;
  }
};

export default bookingReducer;
