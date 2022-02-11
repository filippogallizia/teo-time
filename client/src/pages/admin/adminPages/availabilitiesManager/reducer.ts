import produce from 'immer';
import { ChangeEvent } from 'react';
import { HrsAndMinsType, TimeRangeType } from '../../../../../types/Types';

export type DayAvalSettingsType = {
  breakTimeBtwEventsHours: string;
  breakTimeBtwEventsMinutes: string;
  breakTimeEnd: string;
  breakTimeStart: string;
  day: string;
  eventDurationHours: string;
  eventDurationMinutes: string;
  id?: number;
  workTimeEnd: string;
  workTimeStart: string;
};

export const SET_STATE = 'SET_STATE';
export const MODAL = 'MODAL';
export const SET_SELECTED_DAY = 'SET_SELECTED_DAY';
export const EDIT_SELECTED_DAY = 'EDIT_SELECTED_DAY';
//type ActionWeekAvailSettings = {
//  type: typeof SET_WEEK_AVAL_SETTINGS;
//  payload: { day: string; e: ChangeEvent<HTMLInputElement> };
//};

//type ActionCurrentAvailSettings = {
//  type: typeof EDIT_SELECTED_AVAL_SETTINGS;
//  payload: DayAvalSettingsType;
//};

export type InitialState = {
  weekAvalSettings: DayAvalSettingsType[];
  modal: ModalType;
  selectedDay: DayAvalSettingsType;
};

export type ModalType = {
  isOpen: boolean;
};

type ActionEditModal = {
  type: typeof MODAL;
  payload: {
    modal: ModalType;
  };
};

type ActionSetState = {
  type: typeof SET_STATE;
  payload: DayAvalSettingsType[];
};

type ActionSetSelectedDay = {
  type: typeof SET_SELECTED_DAY;
  payload: DayAvalSettingsType;
};

type ActionEditSelectedDay = {
  type: typeof EDIT_SELECTED_DAY;
  payload: ChangeEvent<HTMLInputElement>;
};

export type Actions =
  | ActionSetState
  | ActionEditModal
  | ActionSetSelectedDay
  | ActionEditSelectedDay;

const stateReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case SET_STATE:
      return produce(initialState, (draft) => {
        draft.weekAvalSettings = action.payload;
      });

    case SET_SELECTED_DAY:
      return produce(initialState, (draft) => {
        draft.selectedDay = action.payload;
      });

    case EDIT_SELECTED_DAY:
      return produce(initialState, (draft) => {
        const inputName = action.payload.target.id.split('.')[0];
        console.log(inputName, 'inputid');
        //@ts-expect-error
        draft.selectedDay[inputName] = action.payload.target.value;
      });

    case MODAL:
      return produce(initialState, (draft) => {
        draft.modal = action.payload.modal;
      });

    default:
      return initialState;
  }
};

export default stateReducer;

//export const EDIT_SELECTED_AVAL_SETTINGS = 'EDIT_SELECTED_AVAL_SETTINGS';
