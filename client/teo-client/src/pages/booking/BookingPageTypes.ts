import { Dispatch, SetStateAction } from 'react';
import { Actions } from './bookingReducer';

export type BookingComponentType = {
  setSelectionHour: Dispatch<SetStateAction<string>>;
  setAvailabilities: Dispatch<SetStateAction<any>>;
  availabilities: any;
  dispatch: Dispatch<Actions>;
} & CalendarValueType;

export type CalendarValueType = {
  setSelectionDate: Dispatch<SetStateAction<Date>>;
  selectedDate: Date;
};

export type CalendarComponentType = {
  setRenderAvailabilities?: Dispatch<SetStateAction<boolean>>;
} & CalendarValueType;
