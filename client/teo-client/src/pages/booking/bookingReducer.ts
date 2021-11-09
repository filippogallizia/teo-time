import produce from 'immer';
import { ChangeEvent } from 'react';
import { UserType } from '../../../types/Types';

export const SET_AVAILABILITIES = 'SET_AVAILABILITIES';
export const SET_SPECIFIC_USER_BOOKINGS = 'SET_SPECIFIC_USER_BOOKINGS';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAILABILITIES = 'SET_RENDER_AVAILABILITIES';
export const SET_APPOINTMENT_DETAILS = 'SET_APPOINTMENT_DETAILS';
export const SET_ALL_BOOKINGS_AND_USERS = 'SET_ALL_BOOKINGS_AND_USERS';
export const SET_MANAGE_AVAILABILITIES = 'SET_MANAGE_AVAILABILITIES';

export type timeRange = { start: string; end: string };

export type ManageAvailability = {
  day: string;
  parameters?: {
    workTimeRange: {
      start: string;
      end: string;
    };
    breakTimeRange: {
      start: string;
      end: string;
    };
    eventDuration: { hours: number; minutes: number };
    breakTimeBtwEvents: { hours: number; minutes: number };
  };
};

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
    specificUserBookings: BookingAndUser[];
    allBookingsAndUsers: {
      id: number;
      start: string;
      end: string;
      userId: number;
      user: UserType;
    }[][];
    manageAvailabilities: ManageAvailability[];
  };
};

type ActionSetAvailabilities = {
  type: typeof SET_AVAILABILITIES;
  payload: timeRange[];
};

type ActionSetUserAllBookings = {
  type: typeof SET_SPECIFIC_USER_BOOKINGS;
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
type ActionSetRenderAvailabilities = {
  type: typeof SET_RENDER_AVAILABILITIES;
  payload: boolean;
};

type ActionSetManageAvailabilities = {
  type: typeof SET_MANAGE_AVAILABILITIES;
  payload: { day: string; e: ChangeEvent<HTMLInputElement> };
};

export type BookingAndUser = {
  id: number;
  start: string;
  end: string;
  userId: number;
  user: UserType;
};

type ActionSetAllBookingsAndUsers = {
  type: typeof SET_ALL_BOOKINGS_AND_USERS;
  payload: BookingAndUser[][];
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
  | ActionSetAllBookingsAndUsers
  | ActionSetManageAvailabilities;

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
    case SET_MANAGE_AVAILABILITIES:
      return produce(initialState, (draft) => {
        const day = action.payload.day;
        const x = action.payload.e.target.id.split('.');
        draft.schedules.allBookingsAndUsers =
          draft.schedules.manageAvailabilities.map((d: any) => {
            if (d.day === day) {
              console.log('here');
              return (d.parameters[x[0]][x[1]] = action.payload.e.target.value);
            }
            return d;
          });
      });
    default:
      return initialState;
  }
};

export default bookingReducer;
