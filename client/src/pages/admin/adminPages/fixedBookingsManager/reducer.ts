import produce from 'immer';
import { TimeRangeType } from '../../../../../types/Types';
import { HOUR_MINUTE_FORMAT } from '../../../../helpers/utils';
import { weekDays } from '../availabilitiesManager/AvailabilitiesManager';

export const SET_FIXED_BKS = 'SET_FIXED_BKS';
export const ADD_OR_REMOVE_FIXED_BKS = 'ADD_OR_REMOVE_FIXED_BKS';

export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UPLOAD_ALL = 'UPLOAD_ALL';
export const NO_VALUES = 'NO_VALUES';
export const EDIT_START_HOUR = 'EDIT_START_HOUR';
export const EDIT_END_HOUR = 'EDIT_END_HOUR';
export const EDIT_EMAIL = 'EDIT_EMAIL';
export const USER_IS_EDITING = 'USER_IS_EDITING';

export type FixedBookType = TimeRangeType & { key: number; email: string };

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

export type InitialState = {
  fixedBks: FixedBksType[];
  userIsEditing: boolean;
};

type ActionSetEditing = {
  type: typeof USER_IS_EDITING;
  payload: boolean;
};

type ActionSetFixedBks = {
  type: typeof SET_FIXED_BKS;
  payload: FixedBksFromApi[];
};

type ActionEditStartHour = {
  type: typeof EDIT_START_HOUR;
  payload: {
    booking: { day: string; key: number; start: string };
  };
};

type ActionEditEndHour = {
  type: typeof EDIT_END_HOUR;
  payload: {
    booking: { day: string; key: number; end: string };
  };
};

type ActionEditEmail = {
  type: typeof EDIT_EMAIL;
  payload: {
    booking: { day: string; key: number; email: string };
  };
};

type ActionAddFixedBks = {
  type: typeof ADD_OR_REMOVE_FIXED_BKS;
  payload: {
    day: string;
    booking: TimeRangeType & { key: number; email: string };
    type: typeof ADD | typeof DELETE;
  };
};

export type Actions =
  | ActionSetFixedBks
  | ActionAddFixedBks
  | ActionEditStartHour
  | ActionEditEndHour
  | ActionEditEmail
  | ActionSetEditing;

const stateReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
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
                  key: d.id,
                  email: d.email,
                };
              }),
          };
        });
        draft.fixedBks = result;
      });

    case EDIT_START_HOUR:
      return produce(initialState, (draft) => {
        const { day, key, start } = action.payload.booking;

        const singleDayInfo = draft.fixedBks.find((daySettings) => {
          return daySettings.day === day;
        });

        const match = singleDayInfo?.bookings.find((book) => {
          return book.key === key;
        });
        if (match) match.start = start;
      });

    case EDIT_END_HOUR:
      return produce(initialState, (draft) => {
        const { day, key, end } = action.payload.booking;

        const singleDayInfo = draft.fixedBks.find((daySettings) => {
          return daySettings.day === day;
        });

        const match = singleDayInfo?.bookings.find((book) => {
          return book.key === key;
        });
        if (match) match.end = end;
      });

    case EDIT_EMAIL:
      return produce(initialState, (draft) => {
        const { day, key, email } = action.payload.booking;

        const singleDayInfo = draft.fixedBks.find((daySettings) => {
          return daySettings.day === day;
        });

        const match = singleDayInfo?.bookings.find((book) => {
          return book.key === key;
        });
        if (match) match.email = email;
      });

    case ADD_OR_REMOVE_FIXED_BKS:
      return produce(initialState, (draft) => {
        const index = draft.fixedBks.findIndex(
          (x) => x.day === action.payload.day
        );
        if (index > -1) {
          if (action.payload.type === ADD) {
            draft.fixedBks[index].bookings.push(action.payload.booking);
          }
          if (action.payload.type === DELETE) {
            const i = draft.fixedBks[index].bookings.findIndex((book) => {
              return book.key === action.payload.booking.key;
            });
            draft.fixedBks[index].bookings.splice(i, 1);
          }
        }
      });

    case USER_IS_EDITING:
      return produce(initialState, (draft) => {
        draft.userIsEditing = action.payload;
      });

    default:
      return initialState;
  }
};

export default stateReducer;
