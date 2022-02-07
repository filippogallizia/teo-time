import produce from 'immer';
import { TimeRangeType } from '../../../types/Types';

export const SET_AVAL = 'SET_AVAL';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAL = 'SET_RENDER_AVAL';

export type InitialState = {
  schedules: {
    selectedDate: string;
    selectedHour: string;
    availabilities: TimeRangeType[];
    isConfirmPhase: boolean;
    isRenderAval: boolean;
    location: string;
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

type ActionSetConfirmPhase = {
  type: typeof SET_CONFIRM_PHASE;
  payload: boolean;
};
type ActionSetRenderAval = {
  type: typeof SET_RENDER_AVAL;
  payload: boolean;
};

export type Actions =
  | ActionSetAval
  | ActionSetSelectionDate
  | ActionSetSelectionHour
  | ActionSetConfirmPhase
  | ActionSetRenderAval;

const stateReducer = (initialState: InitialState, action: Actions) => {
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
        console.log(action.payload, 'action.payload');
        draft.schedules.selectedHour = action.payload;
      });
    case SET_CONFIRM_PHASE:
      return produce(initialState, (draft) => {
        draft.schedules.isConfirmPhase = action.payload;
      });
    case SET_RENDER_AVAL:
      return produce(initialState, (draft) => {
        draft.schedules.isRenderAval = action.payload;
      });

    default:
      return initialState;
  }
};

export default stateReducer;
