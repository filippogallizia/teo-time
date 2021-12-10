import produce from 'immer';
import { ChangeEvent } from 'react';
import { HrsAndMinsType, TimeRangeType, UserType } from '../../../types/Types';
import { HOUR_MINUTE_FORMAT } from '../../shared/locales/utils';
import { weekDays } from '../admin/adminPages/availabilitiesManager/AvailabilitiesManager';

export const SET_AVAL = 'SET_AVAL';
export const SET_USER_BOOKINGS = 'SET_USER_BOOKINGS';
export const SET_SELECTION_DATE = 'SET_SELECTION_DATE';
export const SET_SELECTION_HOUR = 'SET_SELECTION_HOUR';
export const SET_CONFIRM_PHASE = 'SET_CONFIRM_PHASE';
export const SET_RENDER_AVAL = 'SET_RENDER_AVAL';
export const SET_BKGS_AND_USERS = 'SET_BKGS_AND_USERS';
export const SET_WEEK_AVAL_SETTINGS = 'SET_WEEK_AVAL_SETTINGS';
export const SET_ALL_WEEK_AVAL_SETTINGS = 'SET_ALL_WEEK_AVAL_SETTINGS';
export const FORCE_RENDER = 'FORCE_RENDER';
export const ADD_OR_REMOVE_HOLIDAY = 'ADD_OR_REMOVE_HOLIDAY';
export const UPLOAD_HOLIDAY = 'UPLOAD_HOLIDAY';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_FIXED_BKS = 'SET_FIXED_BKS';
export const ADD_OR_REMOVE_FIXED_BKS = 'ADD_OR_REMOVE_FIXED_BKS';
export const UPLOAD_FIXED_BKS = 'UPLOAD_FIXED_BKS';

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
    userBookings: BookingAndUser[];
    bookingsAndUsers: {
      id: number;
      start: string;
      end: string;
      userId: number;
      user: UserType;
    }[][];
    weekAvalSettings: DayAvalSettingsType[];
    fixedBks: FixedBksType[];
    forceRender: number;
    holidays: Array<{
      start: string;
      end: string;
      isFromServer: boolean;
      localId?: number;
    }>;
    location: string;
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

type ActionAllWeekAvailSettings = {
  type: typeof SET_ALL_WEEK_AVAL_SETTINGS;
  payload: DayAvalSettingsType[];
};

type ActionAddFixedBks = {
  type: typeof ADD_OR_REMOVE_FIXED_BKS;
  payload: {
    day: string;
    booking: TimeRangeType & { id: number; email: string };
    type:
      | typeof ADD
      | typeof DELETE
      | typeof UPLOAD_START_DATE
      | typeof UPLOAD_END_DATE
      | typeof UPLOAD_EMAIL_CLIENT;
  };
};

type ActionSetFixedBks = {
  type: typeof SET_FIXED_BKS;
  payload: FixedBksFromApi[];
};

type ActionAddHoliday = {
  type: typeof ADD_OR_REMOVE_HOLIDAY;
  payload: HolidayPayload;
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

type ActionSetHoliday = {
  type: typeof UPLOAD_HOLIDAY;
  payload: HolidayPayload;
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
  | ActionForceRender
  | ActionAddHoliday
  | ActionSetHoliday
  | ActionSetLocation
  | ActionAllWeekAvailSettings
  | ActionAddFixedBks
  | ActionSetFixedBks;

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
    case SET_ALL_WEEK_AVAL_SETTINGS:
      return produce(initialState, (draft) => {
        draft.schedules.weekAvalSettings = action.payload;
      });
    case SET_WEEK_AVAL_SETTINGS:
      return produce(initialState, (draft) => {
        const day = action.payload.day;
        const x = action.payload.e.target.id.split('.');
        draft.schedules.weekAvalSettings.map((d: any) => {
          if (d.day === day) {
            return (d.parameters[x[0]][x[1]] = action.payload.e.target.value);
          }
          return d;
        });
      });
    case FORCE_RENDER:
      return produce(initialState, (draft) => {
        draft.schedules.forceRender = action.payload;
      });
    case ADD_OR_REMOVE_HOLIDAY:
      return produce(initialState, (draft) => {
        const index = draft.schedules.holidays.findIndex((day) => {
          return day.localId === action.payload.localId;
        });
        if (action.payload.type === ADD) {
          if (draft.schedules.holidays[index]?.isFromServer) {
            draft.schedules.holidays.splice(index, 1);
          } else {
            draft.schedules.holidays.push(action.payload);
          }
        } else {
          draft.schedules.holidays.splice(index, 1);
        }
      });
    case UPLOAD_HOLIDAY:
      return produce(initialState, (draft) => {
        const index = draft.schedules.holidays.findIndex((day: any) => {
          return day.localId === action.payload.localId;
        });
        if (action.payload.type === NO_VALUES) {
          draft.schedules.holidays = [];
        }
        if (index !== -1) {
          if (action.payload.type === UPLOAD_START_DATE) {
            draft.schedules.holidays[index].start = action.payload.start;
          }
          if (action.payload.type === UPLOAD_ALL) {
            draft.schedules.holidays[index] = {
              start: action.payload.start,
              end: action.payload.end,
              localId: action.payload.localId,
              isFromServer: action.payload.isFromServer,
            };
          } else {
            draft.schedules.holidays[index].end = action.payload.end;
          }
        }
      });
    case SET_LOCATION:
      return produce(initialState, (draft) => {
        draft.schedules.location = action.payload.location;
      });
    case ADD_OR_REMOVE_FIXED_BKS:
      return produce(initialState, (draft) => {
        const index = draft.schedules.fixedBks.findIndex(
          (x) => x.day === action.payload.day
        );
        if (index > -1) {
          if (action.payload.type === ADD) {
            draft.schedules.fixedBks[index].bookings.push(
              action.payload.booking
            );
          }
          if (action.payload.type === DELETE) {
            const i = draft.schedules.fixedBks[index].bookings.findIndex(
              (book) => {
                return book.id === action.payload.booking.id;
              }
            );
            draft.schedules.fixedBks[index].bookings.splice(i, 1);
          }
          if (action.payload.type === UPLOAD_START_DATE) {
            const i = draft.schedules.fixedBks[index].bookings.findIndex(
              (book) => {
                return book.id === action.payload.booking.id;
              }
            );
            draft.schedules.fixedBks[index].bookings[i].start =
              action.payload.booking.start;
          }
          if (action.payload.type === UPLOAD_END_DATE) {
            const i = draft.schedules.fixedBks[index].bookings.findIndex(
              (book) => {
                return book.id === action.payload.booking.id;
              }
            );
            draft.schedules.fixedBks[index].bookings[i].end =
              action.payload.booking.end;
          }
          if (action.payload.type === UPLOAD_EMAIL_CLIENT) {
            const i = draft.schedules.fixedBks[index].bookings.findIndex(
              (book) => {
                return book.id === action.payload.booking.id;
              }
            );
            draft.schedules.fixedBks[index].bookings[i].email =
              action.payload.booking.email;
          }
        }
      });
    case SET_FIXED_BKS:
      return produce(initialState, (draft) => {
        const result = weekDays.map((weekDay) => {
          return {
            day: weekDay,
            bookings: action.payload
              .filter((day) => day.day === weekDay)
              .map((d) => {
                return {
                  start: HOUR_MINUTE_FORMAT(d.start),
                  end: HOUR_MINUTE_FORMAT(d.end),
                  id: d.localId,
                  email: d.email,
                };
              }),
          };
        });
        draft.schedules.fixedBks = result;
      });
    default:
      return initialState;
  }
};

export default stateReducer;
