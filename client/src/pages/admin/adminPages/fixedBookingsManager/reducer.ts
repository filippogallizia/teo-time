import produce from 'immer';
import { TimeRangeType } from '../../../../../types/Types';
import { HOUR_MINUTE_FORMAT } from '../../../../helpers/utils';

export const SET_FIXED_BKS = 'SET_FIXED_BKS';
export const ADD_OR_REMOVE_FIXED_BKS = 'ADD_OR_REMOVE_FIXED_BKS';
export const EDIT_BOOKING_DETAILS = 'EDIT_BOOKING_DETAILS';

export const MODAL = 'MODAL';
export const CREATE = 'CREATE';
export const EDIT = 'EDIT';

export const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export type BookingDetailsType = {
  start: string;
  end: string;
  day: string;
  email: string;
  id?: number;
  exceptionDate: Date | undefined;
};

export type FixedBookType = TimeRangeType & {
  id: number;
  email: string;
  day: string;
};

export type FixedBksType = {
  day: string;
  bookings: Array<BookingDetailsType>;
};

export type ModalType = {
  isOpen: boolean;
  mode: typeof CREATE | typeof EDIT;
};

type ActionSetFixedBks = {
  type: typeof SET_FIXED_BKS;
  payload: BookingDetailsType[];
};

type ActionEditModal = {
  type: typeof MODAL;
  payload: {
    modal: ModalType;
  };
};

type ActionEditBookingDetail = {
  type: typeof EDIT_BOOKING_DETAILS;
  payload: {
    bookingDetails: BookingDetailsType;
  };
};

export type Actions =
  | ActionSetFixedBks
  | ActionEditModal
  | ActionEditBookingDetail;

export type InitialState = {
  fixedBks: FixedBksType[];
  modal: ModalType;
  bookingDetails: BookingDetailsType;
};

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
                  day: d.day,
                  id: d.id,
                  email: d.email,
                  exceptionDate: d.exceptionDate
                    ? new Date(d.exceptionDate)
                    : undefined,
                };
              }),
          };
        });
        draft.fixedBks = result;
      });

    case MODAL:
      return produce(initialState, (draft) => {
        draft.modal = action.payload.modal;
      });

    case EDIT_BOOKING_DETAILS:
      return produce(initialState, (draft) => {
        draft.bookingDetails = action.payload.bookingDetails;
      });

    default:
      return initialState;
  }
};

export default stateReducer;
