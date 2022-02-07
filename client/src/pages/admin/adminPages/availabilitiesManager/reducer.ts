import produce from 'immer';
import { ChangeEvent } from 'react';
import { HrsAndMinsType, TimeRangeType } from '../../../../../types/Types';

export type DayAvalSettingsType = {
  day: string;
  parameters?: {
    workTimeRange: TimeRangeType;
    breakTimeRange: TimeRangeType;
    eventDuration: HrsAndMinsType;
    breakTimeBtwEvents: HrsAndMinsType;
  };
};

export const SET_WEEK_AVAL_SETTINGS = 'SET_WEEK_AVAL_SETTINGS';
export const SET_ALL_WEEK_AVAL_SETTINGS = 'SET_ALL_WEEK_AVAL_SETTINGS';

export type InitialState = {
  weekAvalSettings: DayAvalSettingsType[];
};

type ActionWeekAvailSettings = {
  type: typeof SET_WEEK_AVAL_SETTINGS;
  payload: { day: string; e: ChangeEvent<HTMLInputElement> };
};

type ActionAllWeekAvailSettings = {
  type: typeof SET_ALL_WEEK_AVAL_SETTINGS;
  payload: DayAvalSettingsType[];
};

export type Actions = ActionWeekAvailSettings | ActionAllWeekAvailSettings;

const stateReducer = (initialState: InitialState, action: Actions) => {
  switch (action.type) {
    case SET_ALL_WEEK_AVAL_SETTINGS:
      return produce(initialState, (draft) => {
        draft.weekAvalSettings = action.payload;
      });
    case SET_WEEK_AVAL_SETTINGS:
      return produce(initialState, (draft) => {
        const day = action.payload.day;
        const x = action.payload.e.target.id.split('.');
        draft.weekAvalSettings.map((d: any) => {
          if (d.day === day) {
            return (d.parameters[x[0]][x[1]] = action.payload.e.target.value);
          }
          return d;
        });
      });

    default:
      return initialState;
  }
};

export default stateReducer;
