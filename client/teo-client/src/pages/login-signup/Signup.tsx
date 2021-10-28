import React from 'react';
import GeneralButton from '../../component/GeneralButton';
import { signupService } from './service/LoginService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import EventListener from '../../helpers/EventListener';
import { useHistory } from 'react-router-dom';
import Routes from '../../routes';
import { TITLE } from '../../constant';

type InitialFormType = {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
};

let schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  phoneNumber: yup.number().required(),
});

const Signup = () => {
  const { register, handleSubmit, formState } = useForm<InitialFormType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const history = useHistory();
  const { isValid, errors } = formState;
  const myFunc = async (value: InitialFormType) => {
    try {
      await signupService(() => {}, {
        email: value.email,
        name: value.name,
        password: value.password,
        phoneNumber: value.phoneNumber,
      });
    } catch (e: any) {
      EventListener.emit('errorHandling', e.response);
    }
  };
  const buttonStyle = isValid
    ? 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
    : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-500 opacity-50 cursor-not-allowed';
  return (
    <form
      className="grid col-1 gap-4 justify-items-center"
      onSubmit={handleSubmit(myFunc)}
    >
      <p className={`${TITLE}`}>SIGN UP</p>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Nome
        </label>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          type="text"
          id="name"
          {...register('name', { required: true })}
        />
        {errors.name?.type === 'required' && 'First name is required'}
      </div>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          id="email"
          type="email"
          {...register('email', { required: true })}
        />
        {errors.email?.type === 'required' && 'Email is required'}
      </div>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="phoneNumber"
        >
          Numero di telefono
        </label>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          id="phoneNumber"
          type="tel"
          {...register('phoneNumber', { required: true })}
        />
        {errors.email?.type === 'required' && 'Email is required'}
      </div>
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
          id="password"
          autoComplete="current-password"
          type="password"
          {...register('password', { required: true })}
        />
        {errors.password?.type === 'required' && 'password is required'}
      </div>

      <div>
        <input className={buttonStyle} type="submit" value="SIGN UP" />
      </div>
      <div>
        <GeneralButton
          buttonText="LOG IN"
          onClick={() => history.push(Routes.LOGIN)}
        />
      </div>
    </form>
  );
};

export default Signup;
