import React from 'react';
import GeneralButton from '../../component/GeneralButton';
import { loginService } from './service/LoginService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import EventListener from '../../helpers/EventListener';
import { useHistory } from 'react-router-dom';
import Routes from '../../routes';
import { GRID_ONE_COL, TITLE } from '../../constant';

type InitialFormType = {
  email: string;
  password: string;
};

let schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Login = () => {
  const { register, handleSubmit, formState } = useForm<InitialFormType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const history = useHistory();
  const { isValid, errors } = formState;
  const myFunc = async (value: InitialFormType) => {
    const handleSuccess = (tokenValue: string) => {
      localStorage.setItem('token', tokenValue);
    };
    try {
      await loginService(handleSuccess, {
        email: value.email,
        password: value.password,
      });
      history.push(Routes.HOMEPAGE_BOOKING);
    } catch (e: any) {
      EventListener.emit('errorHandling', e.response);
    }
  };
  const buttonStyle = isValid
    ? 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
    : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-500 opacity-50 cursor-not-allowed';
  return (
    <form className={GRID_ONE_COL} onSubmit={handleSubmit(myFunc)}>
      <p className={`${TITLE}`}>LOG IN</p>
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
          {...register('email', { required: true })}
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
        <input className={buttonStyle} type="submit" value="LOG IN" />
      </div>
      <div>
        <GeneralButton
          buttonText="SIGNUP"
          onClick={() => history.push(Routes.SIGNUP)}
        />
      </div>
    </form>
  );
};

export default Login;
