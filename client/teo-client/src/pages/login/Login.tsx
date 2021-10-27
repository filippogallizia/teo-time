import React from 'react';
import GeneralButton from '../../component/GeneralButton';
import { signup } from './service/LoginService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import EventListener from '../../helpers/EventListener';

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

const Login = () => {
  const { register, handleSubmit, formState } = useForm<InitialFormType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, errors } = formState;
  const myFunc = async (value: InitialFormType) => {
    try {
      await signup(() => {}, {
        email: value.email,
        phoneNumber: value.phoneNumber,
        name: value.name,
      });
      alert('check your email!');
    } catch (e: any) {
      EventListener.emit('errorHandling', e.response);
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
          buttonText="LOG IN"
          onClick={handleSubmit(myFunc)}
        />
      </div>
    </div>
  );
};

export default Login;
