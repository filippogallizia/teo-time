import produce from 'immer';
import { ChangeEvent } from 'react';
import { HrsAndMinsType, TimeRangeType, UserType } from '../../../types/Types';

export const SET_AVAL = 'SET_AVAL';
export const SET_USER_BOOKINGS = 'SET_USER_BOOKINGS';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAL = 'SET_RENDER_AVAL';
export const SET_BKGS_AND_USERS = 'SET_BKGS_AND_USERS';
export const SET_WEEK_AVAL_SETTINGS = 'SET_WEEK_AVAL_SETTINGS';
export const FORCE_RENDER = 'FORCE_RENDER';

export type DayAvalSettingsType = {
  day: string;
  parameters?: {
    workTimeRange: TimeRangeType;
    breakTimeRange: TimeRangeType;
    eventDuration: HrsAndMinsType;
    breakTimeBtwEvents: HrsAndMinsType;
  };
};

export type InitialState = {
  schedules: {
    selectedDate: string;
    selectedHour: string;
    availabilities: TimeRangeType[];
    isConfirmPhase: boolean;
    isRenderAval: boolean;
    userBookings: BookingAndUser[];
    bookingsAndUsers: {
      id: number;
      start: string;
      end: string;
      userId: number;
      user: UserType;
    }[][];
    weekAvalSettings: DayAvalSettingsType[];
    forceRender: number;
  };
};

type ActionSetAval = {
  type: typeof SET_AVAL;
  payload: TimeRangeType[];
};

type ActionSetUserBookings = {
  type: typeof SET_USER_BOOKINGS;
  payload: BookingAndUser[];
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

type ActionWeekAvailSettings = {
  type: typeof SET_WEEK_AVAL_SETTINGS;
  payload: { day: string; e: ChangeEvent<HTMLInputElement> };
};

export type BookingAndUser = {
  id: number;
  start: string;
  end: string;
  userId: number;
  user: UserType;
};

type ActionSetBookingsAndUsers = {
  type: typeof SET_BKGS_AND_USERS;
  payload: BookingAndUser[][];
};

type ActionForceRender = {
  type: typeof FORCE_RENDER;
  payload: number;
};

export type Actions =
  | ActionSetAval
  | ActionSetSelectionDate
  | ActionSetSelectionHour
  | ActionSetConfirmPhase
  | ActionSetRenderAval
  | ActionSetUserBookings
  | ActionSetBookingsAndUsers
  | ActionWeekAvailSettings
  | ActionForceRender;

const stateReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case SET_AVAL:
      return produce(initialState, (draft) => {
        draft.schedules.availabilities = action.payload;
      });
    case SET_USER_BOOKINGS:
      return produce(initialState, (draft) => {
        draft.schedules.userBookings = action.payload;
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
    case SET_BKGS_AND_USERS:
      return produce(initialState, (draft) => {
        draft.schedules.bookingsAndUsers = action.payload;
      });
    case SET_WEEK_AVAL_SETTINGS:
      return produce(initialState, (draft) => {
        const day = action.payload.day;
        const x = action.payload.e.target.id.split('.');
        draft.schedules.bookingsAndUsers = draft.schedules.weekAvalSettings.map(
          (d: any) => {
            if (d.day === day) {
              return (d.parameters[x[0]][x[1]] = action.payload.e.target.value);
            }
            return d;
          }
        );
      });
    case FORCE_RENDER:
      return produce(initialState, (draft) => {
        draft.schedules.forceRender = action.payload;
      });
    default:
      return initialState;
  }
};

export default stateReducer;
