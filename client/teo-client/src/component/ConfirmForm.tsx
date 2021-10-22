import { DateTime } from 'luxon';
import React from 'react';
import { parseHoursToObject } from '../helpers/helpers';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import {
  SET_APPOINTMENT_DETAILS,
  SET_CONFIRM_PHASE,
  SET_RENDER_AVAILABILITIES,
} from '../pages/booking/bookingReducer';
import { createBooking } from '../service/calendar.service';
import { useForm } from 'react-hook-form';
import GeneralButton from './GeneralButton';
import { useHistory } from 'react-router-dom';
import { SUCCESSFUL_PAGE } from '../constant';

type InitialFormType = {
  name: string;
  email: string;
};

const ConfirmForm = ({ dispatch, state }: BookingComponentType) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InitialFormType>();
  let history = useHistory();
  const myFunc = async () => {
    const mapped: { hours: number; minutes: number } = parseHoursToObject(
      state.schedules.selectedHour
    );
    const parsedDate = DateTime.fromJSDate(state.schedules.selectedDate);
    try {
      const handleSuccess = (response: any) => {
        dispatch({
          type: SET_APPOINTMENT_DETAILS,
          payload: { id: response.id, start: response.start },
        });
        localStorage.setItem('APPOINTMENT_DETAILS', response.start);
      };
      await createBooking(handleSuccess, {
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus({ hours: 1, minutes: 30 }).toISO(),
      });
      console.log({
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus({ hours: 1, minutes: 30 }).toISO(),
      });
      // dispatch({ type: SET_CONFIRM_PHASE, payload: false });
      // dispatch({ type: SET_RENDER_AVAILABILITIES, payload: false });
      history.push(SUCCESSFUL_PAGE);
    } catch (e) {
      console.log(e);
    }
    // handleSubmit((value) => console.log(value, 'value'))();
  };

  console.log(watch('name'), 'name');

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <div className="m-4 mt-0">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="name"
            id="name"
            {...register('name', { required: true })}
            // onChange={this.setValue('username')}
            // value={username}
          />
          {errors.name?.type === 'required' && 'First name is required'}
        </div>
        <div className="m-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Email
          </label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            id="email"
            {...register('email', { required: true })}
            // onChange={this.setValue('email')}
            // value={email}
          />
          {errors.email?.type === 'required' && 'Email is required'}
        </div>
      </div>
      <div>
        <GeneralButton buttonText="Schedule Event" onClick={myFunc} />
      </div>
    </div>
  );
};

export default ConfirmForm;
