import { Dispatch, SetStateAction } from 'react';

export type BookingComponentType = {
  setSelectionHour: Dispatch<SetStateAction<string>>;
} & CalendarValueType;

export type CalendarValueType = {
  setSelectionDate: Dispatch<SetStateAction<Date>>;
  selectedDate: Date;
};

export type CalendarComponentType = {
  setRenderAvailabilities?: Dispatch<SetStateAction<boolean>>;
} & CalendarValueType;
