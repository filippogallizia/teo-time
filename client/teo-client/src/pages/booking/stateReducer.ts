import produce from 'immer';
import { HrsAndMinsType, TimeRangeType, UserType } from '../../../types/Types';

export const SET_AVAL = 'SET_AVAL';
export const SET_USER_BOOKINGS = 'SET_USER_BOOKINGS';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAL = 'SET_RENDER_AVAL';

export const SET_LOCATION = 'SET_LOCATION';

export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UPLOAD_START_DATE = 'UPLOAD_START_DATE';
export const UPLOAD_END_DATE = 'UPLOAD_END_DATE';
export const UPLOAD_EMAIL_CLIENT = 'UPLOAD_EMAIL_CLIENT';
export const UPLOAD_ALL = 'UPLOAD_ALL';
export const NO_VALUES = 'NO_VALUES';

export type DayAvalSettingsType = {
  day: string;
  parameters?: {
    workTimeRange: TimeRangeType;
    breakTimeRange: TimeRangeType;
    eventDuration: HrsAndMinsType;
    breakTimeBtwEvents: HrsAndMinsType;
  };
};

export type FixedBookType = TimeRangeType & { id: number; email: string };

export type FixedBksType = {
  day: string;
  bookings: Array<FixedBookType>;
};

export type FixedBksFromApi = {
  id: number;
  start: string;
  end: string;
  email: string;
  day: string;
  localId: number;
};

export type Holiday = {
  localId: number;
  start: string;
  end: string;
  isFromServer: boolean;
};

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

type LocationPayload = {
  location: string;
};

type ActionSetLocation = {
  type: typeof SET_LOCATION;
  payload: LocationPayload;
};

export type HolidayPayload = {
  type:
    | typeof ADD
    | typeof DELETE
    | typeof UPLOAD_END_DATE
    | typeof UPLOAD_START_DATE
    | typeof UPLOAD_ALL
    | typeof NO_VALUES;
  isFromServer: boolean;
  localId: number;
} & TimeRangeType;

export type Actions =
  | ActionSetAval
  | ActionSetSelectionDate
  | ActionSetSelectionHour
  | ActionSetConfirmPhase
  | ActionSetRenderAval
  | ActionSetLocation;

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

    case SET_LOCATION:
      return produce(initialState, (draft) => {
        draft.schedules.location = action.payload.location;
      });

    default:
      return initialState;
  }
};

export default stateReducer;
