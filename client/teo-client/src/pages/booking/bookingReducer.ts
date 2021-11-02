import produce from 'immer';
import { BookingType, UserType } from '../../../../../types/Types';

export const SET_AVAILABILITIES = 'SET_AVAILABILITIES';
export const SET_SPECIFIC_USER_BOOKINGS = 'SET_SPECIFIC_USER_BOOKINGS';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAILABILITIES = 'SET_RENDER_AVAILABILITIES';
export const SET_APPOINTMENT_DETAILS = 'SET_APPOINTMENT_DETAILS';
export const SET_ALL_BOOKINGS_AND_USERS = 'SET_ALL_BOOKINGS_AND_USERS';

export type timeRange = { start: string; end: string };

export type InitialState = {
  schedules: {
    selectedDate: string;
    selectedHour: string;
    availabilities: timeRange[];
    isConfirmPhase: boolean;
    isRenderAvailabilities: boolean;
    appointmentDetails: {
      id: number;
      start: string;
    };
    specificUserBookings: timeRange[];
    allBookingsAndUsers: {
      id: number;
      start: string;
      end: string;
      userId: number;
      user: UserType;
      // open: boolean;
    }[][];
  };
};

type ActionSetAvailabilities = {
  type: typeof SET_AVAILABILITIES;
  payload: timeRange[];
};

type ActionSetUserAllBookings = {
  type: typeof SET_SPECIFIC_USER_BOOKINGS;
  payload: timeRange[];
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
type ActionSetRenderAvailabilities = {
  type: typeof SET_RENDER_AVAILABILITIES;
  payload: boolean;
};

type ActionSetAllBookingsAndUsers = {
  type: typeof SET_ALL_BOOKINGS_AND_USERS;
  payload: {
    id: number;
    start: string;
    end: string;
    userId: number;
    user: UserType;
    // open: boolean;
  }[][];
};

type ActionSetAppointmentDetails = {
  type: typeof SET_APPOINTMENT_DETAILS;
  payload: {
    id: number;
    start: string;
  };
};

export type Actions =
  | ActionSetAvailabilities
  | ActionSetSelectionDate
  | ActionSetSelectionHour
  | ActionSetConfirmPhase
  | ActionSetRenderAvailabilities
  | ActionSetAppointmentDetails
  | ActionSetUserAllBookings
  | ActionSetAllBookingsAndUsers;

const bookingReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case SET_AVAILABILITIES:
      return produce(initialState, (draft) => {
        draft.schedules.availabilities = action.payload;
      });
    case SET_SPECIFIC_USER_BOOKINGS:
      return produce(initialState, (draft) => {
        draft.schedules.specificUserBookings = action.payload;
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
    case SET_APPOINTMENT_DETAILS:
      return produce(initialState, (draft) => {
        draft.schedules.appointmentDetails = action.payload;
      });
    case SET_ALL_BOOKINGS_AND_USERS:
      return produce(initialState, (draft) => {
        draft.schedules.allBookingsAndUsers = action.payload;
      });
    default:
      return initialState;
  }
};

export default bookingReducer;
