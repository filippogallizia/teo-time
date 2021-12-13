import React, { useContext, useState } from 'react';
import GeneralButton, { buttonStyle } from '../../component/GeneralButton';
import {
  loginService,
  postEmailForResetPassword,
} from './service/LoginService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Routes from '../../routes';
import {
  ACCESS_TOKEN,
  GRID_ONE_COL,
  SECONDARY_LINK,
  TITLE,
  USER_INFO,
} from '../../shared/locales/constant';
import { handleToastInFailRequest } from '../../shared/locales/utils';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { UserType } from '../../../types/Types';
import { UserContext } from '../../component/UserContext';
import GoogleLoginComponent from './GoogleLogin';
import { SelfCenterLayout } from '../../component/GeneralLayouts';
import LoadingService from '../../component/loading/LoadingService';

export const ForgotPassword = () => {
  const [emailValue, setEmail] = useState('');
  const [requestSuccess, setSuccess] = useState(false);

  return (
    <>
      {!requestSuccess ? (
        <div className="grid col-1 gap-4 justify-items-center">
          <p className={`${TITLE}`}>{i18n.t('forgotPassword.title')}</p>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              {i18n.t('form.email')}
            </label>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              id="email"
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <GeneralButton
              buttonText={i18n.t('forgotPassword.buttonReset')}
              onClick={() => {
                const asyncFn = async () => {
                  try {
                    await postEmailForResetPassword(
                      (response: any) => {
                        toast.success(response);
                      },
                      { email: emailValue }
                    );
                    setSuccess(true);
                  } catch (e) {
                    handleToastInFailRequest(e, toast);
                  }
                };
                asyncFn();
              }}
            />
          </div>
        </div>
      ) : (
        <p>{i18n.t('forgotPassword.onSuccess.body')}</p>
      )}
    </>
  );
};

type InitialFormType = {
  email: string;
  password: string;
};

let schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .test(function (value) {
      return true;
    }),
});

const Login = ({ dispatch, state }: BookingComponentType) => {
  const { register, handleSubmit, formState } = useForm<InitialFormType>({
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  });
  const history = useHistory();
  const { setUser, setToken } = useContext(UserContext);
  const { isValid, errors } = formState;

  const myFunc = async (value: InitialFormType) => {
    const handleSuccess = (response: { token: string; user: UserType }) => {
      localStorage.setItem(ACCESS_TOKEN, response.token);
      setToken(response.token);
      if (response.user) {
        localStorage.setItem(USER_INFO, JSON.stringify(response.user));
        setUser(response.user);
      }
    };
    try {
      LoadingService.show();
      await loginService(handleSuccess, {
        email: value.email,
        password: value.password,
      });
      LoadingService.hide();
      history.push(Routes.HOMEPAGE_BOOKING);
    } catch (e: any) {
      LoadingService.hide();
      handleToastInFailRequest(e, toast);
    }
  };

  return (
    <SelfCenterLayout>
      <form className={GRID_ONE_COL} onSubmit={handleSubmit(myFunc)}>
        <p className={`${TITLE}`}>{i18n.t('loginPage.title')}</p>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            {i18n.t('form.email')}
          </label>
          <input
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            id="email"
            autoComplete="email"
            {...register('email', { required: true })}
          />
          {errors.email?.type === 'required' && 'Email is required'}
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            {i18n.t('form.password')}
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
          <input
            className={buttonStyle(isValid)}
            type="submit"
            value="Accedi"
          />
        </div>
        <div>
          <GeneralButton
            buttonText={i18n.t('signUp.mainButton')}
            onClick={() => history.push(Routes.SIGNUP)}
          />
        </div>
        <div
          className={SECONDARY_LINK}
          onClick={() => {
            history.push(Routes.LOGIN_FORGOT_PASSWORD);
          }}
        >
          {i18n.t('loginPage.passwordLost')}
        </div>
        <div className="border-b-2 border-black	text-center">Oppure</div>
        <div>
          <GoogleLoginComponent />{' '}
        </div>
      </form>
    </SelfCenterLayout>
  );
};

export default Login;
