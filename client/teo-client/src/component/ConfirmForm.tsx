import { DateTime } from 'luxon';
import React from 'react';
import { parseHoursToObject } from '../helpers/helpers';
import { BookingComponentType } from '../pages/booking/BookingPageTypes';
import { SET_APPOINTMENT_DETAILS } from '../pages/booking/bookingReducer';
import { createBooking } from '../services/calendar.service';
import { useForm } from 'react-hook-form';
import GeneralButton from './GeneralButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signup } from '../pages/login/service/LoginService';

type InitialFormType = {
  name: string;
  email: string;
  phoneNumber: number;
};

let schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.number().required(),
});

const ConfirmForm = ({ dispatch, state }: BookingComponentType) => {
  const { register, handleSubmit, formState } = useForm<InitialFormType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const myFunc = async (value: InitialFormType) => {
    const mapped: { hours: number; minutes: number } = parseHoursToObject(
      state.schedules.selectedHour
    );
    const parsedDate = DateTime.fromISO(state.schedules.selectedDate);
    try {
      const handleSuccess = (response: any) => {
        dispatch({
          type: SET_APPOINTMENT_DETAILS,
          payload: { id: response.id, start: response.start },
        });
        localStorage.setItem('APPOINTMENT_DETAILS', response.start);
      };
      await signup(() => {}, {
        email: value.email,
        phoneNumber: value.phoneNumber,
        name: value.name,
      });
      await createBooking(handleSuccess, {
        start: parsedDate.plus(mapped).toISO(),
        end: parsedDate.plus(mapped).plus({ hours: 1, minutes: 30 }).toISO(),
        email: value.email,
      });
      alert('check your email!');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <div className="m-4 mt-0">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome
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
        <div className="m-4 mt-0">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Telefono
          </label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="phoneNumber"
            id="phoneNumber"
            {...register('phoneNumber', { required: true })}
            // onChange={this.setValue('username')}
            // value={username}
          />
          {errors.phoneNumber?.type === 'required' && 'First name is required'}
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
          />
          {errors.email?.type === 'required' && 'Email is required'}
        </div>
      </div>
      <div>
        <GeneralButton
          disabled={!isValid}
          buttonText="Schedule Event"
          onClick={handleSubmit(myFunc)}
        />
      </div>
    </div>
  );
};

export default ConfirmForm;
