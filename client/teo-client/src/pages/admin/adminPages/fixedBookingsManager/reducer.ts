import produce from 'immer';
import { HrsAndMinsType, TimeRangeType } from '../../../../../types/Types';
import { HOUR_MINUTE_FORMAT } from '../../../../shared/locales/utils';
import { weekDays } from '../availabilitiesManager/AvailabilitiesManager';

export const SET_FIXED_BKS = 'SET_FIXED_BKS';
export const ADD_OR_REMOVE_FIXED_BKS = 'ADD_OR_REMOVE_FIXED_BKS';

export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UPLOAD_START_DATE = 'UPLOAD_START_DATE';
export const UPLOAD_END_DATE = 'UPLOAD_END_DATE';
export const UPLOAD_EMAIL_CLIENT = 'UPLOAD_EMAIL_CLIENT';
export const UPLOAD_ALL = 'UPLOAD_ALL';
export const NO_VALUES = 'NO_VALUES';

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

export type InitialState = {
  fixedBks: FixedBksType[];
};

type ActionSetFixedBks = {
  type: typeof SET_FIXED_BKS;
  payload: FixedBksFromApi[];
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

export type Actions = ActionSetFixedBks | ActionAddFixedBks;

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
                  id: d.localId,
                  email: d.email,
                };
              }),
          };
        });
        draft.fixedBks = result;
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
              return book.id === action.payload.booking.id;
            });
            draft.fixedBks[index].bookings.splice(i, 1);
          }
          if (action.payload.type === UPLOAD_START_DATE) {
            const i = draft.fixedBks[index].bookings.findIndex((book) => {
              return book.id === action.payload.booking.id;
            });
            draft.fixedBks[index].bookings[i].start =
              action.payload.booking.start;
          }
          if (action.payload.type === UPLOAD_END_DATE) {
            const i = draft.fixedBks[index].bookings.findIndex((book) => {
              return book.id === action.payload.booking.id;
            });
            draft.fixedBks[index].bookings[i].end = action.payload.booking.end;
          }
          if (action.payload.type === UPLOAD_EMAIL_CLIENT) {
            const i = draft.fixedBks[index].bookings.findIndex((book) => {
              return book.id === action.payload.booking.id;
            });
            draft.fixedBks[index].bookings[i].email =
              action.payload.booking.email;
          }
        }
      });
    default:
      return initialState;
  }
};

export default stateReducer;
