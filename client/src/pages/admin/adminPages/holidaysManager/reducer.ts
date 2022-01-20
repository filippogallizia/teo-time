import produce from 'immer';
import { TimeRangeType } from '../../../../../types/Types';

export const ADD_OR_REMOVE_HOLIDAY = 'ADD_OR_REMOVE_HOLIDAY';
export const UPLOAD_HOLIDAY = 'UPLOAD_HOLIDAY';

export const ADD = 'ADD';
export const DELETE = 'DELETE';
export const UPLOAD_START_DATE = 'UPLOAD_START_DATE';
export const UPLOAD_END_DATE = 'UPLOAD_END_DATE';
export const UPLOAD_EMAIL_CLIENT = 'UPLOAD_EMAIL_CLIENT';
export const UPLOAD_ALL = 'UPLOAD_ALL';
export const NO_VALUES = 'NO_VALUES';

export type Holiday = {
  localId: number;
  start: string;
  end: string;
  isFromServer: boolean;
};

export type InitialState = {
  holidays: Array<{
    start: string;
    end: string;
    isFromServer: boolean;
    localId?: number;
  }>;
};

type ActionAddHoliday = {
  type: typeof ADD_OR_REMOVE_HOLIDAY;
  payload: HolidayPayload;
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

export type Actions = ActionAddHoliday | ActionSetHoliday;

const reducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case ADD_OR_REMOVE_HOLIDAY:
      return produce(initialState, (draft) => {
        const index = draft.holidays.findIndex((day) => {
          return day.localId === action.payload.localId;
        });
        if (action.payload.type === ADD) {
          if (draft.holidays[index]?.isFromServer) {
            draft.holidays.splice(index, 1);
          } else {
            draft.holidays.push(action.payload);
          }
        } else {
          draft.holidays.splice(index, 1);
        }
      });
    case UPLOAD_HOLIDAY:
      return produce(initialState, (draft) => {
        const index = draft.holidays.findIndex((day: any) => {
          return day.localId === action.payload.localId;
        });
        if (action.payload.type === NO_VALUES) {
          draft.holidays = [];
        }
        if (index !== -1) {
          if (action.payload.type === UPLOAD_START_DATE) {
            draft.holidays[index].start = action.payload.start;
          }
          if (action.payload.type === UPLOAD_ALL) {
            draft.holidays[index] = {
              start: action.payload.start,
              end: action.payload.end,
              localId: action.payload.localId,
              isFromServer: action.payload.isFromServer,
            };
          } else {
            draft.holidays[index].end = action.payload.end;
          }
        }
      });

    default:
      return initialState;
  }
};

export default reducer;
