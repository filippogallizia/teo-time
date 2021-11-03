import React, { useEffect, useState } from 'react';

import {
  postOtpForVerification,
  postNewPassword,
} from './service/LoginService';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Routes from '../../routes';
import { GRID_ONE_COL, TITLE } from '../../shared/locales/constant';
import { handleToastInFailRequest } from '../../shared/locales/utils';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import { BookingComponentType } from '../booking/BookingPageTypes';
import { useLocation } from 'react-router-dom';
import { buttonStyle } from '../../component/GeneralButton';

type InitialFormType = {
  newPassword: string;
  newPasswordRepeat: string;
};

let schema = yup.object().shape({
  newPassword: yup.string().required(),
  newPasswordRepeat: yup.string().required(),
});

const ResetPassword = ({ dispatch, state }: BookingComponentType) => {
  const { register, handleSubmit, formState } = useForm<InitialFormType>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const [isAllowToReset, setAllowReset] = useState(false);
  const search = useLocation().search;
  const history = useHistory();
  const { isValid, errors } = formState;
  const resetPasswordToken = new URLSearchParams(search).get(
    'resetPasswordToken'
  );

  useEffect(() => {
    if (resetPasswordToken && resetPasswordToken?.length > 0) {
      try {
        const asyncFn = async () => {
          const handleSuccess = (response: any) => {
            setAllowReset(true);
          };
          await postOtpForVerification(handleSuccess, { resetPasswordToken });
        };
        asyncFn();
      } catch (e) {
        console.log(e);
      }
    }
    console.log(resetPasswordToken, 'resetPasswordToken');
  }, [resetPasswordToken]);

  const myFunc = async (value: InitialFormType) => {
    const handleSuccess = (response: any) => {
      console.log(response);
      console.log(response);
      toast(i18n.t(response));
    };
    try {
      await postNewPassword(handleSuccess, {
        resetPasswordToken,
        newPassword: value.newPassword,
      });
      history.push(Routes.LOGIN);
    } catch (e: any) {
      handleToastInFailRequest(e, toast);
    }
  };

  return (
    <>
      {isAllowToReset ? (
        <form className={GRID_ONE_COL} onSubmit={handleSubmit(myFunc)}>
          <p className={`${TITLE}`}>{i18n.t('resetPassword.title')}</p>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {i18n.t('resetPassword.form.newPassword')}
            </label>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              id="newPassword"
              autoComplete="current-password"
              type="password"
              {...register('newPassword', { required: true })}
            />
            {errors.newPassword?.type === 'required' && 'password is required'}
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPasswordRepeat"
            >
              {i18n.t('resetPassword.form.newPasswordRepeat')}
            </label>
            <input
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              id="newPasswordRepeat"
              autoComplete="current-password"
              type="password"
              {...register('newPasswordRepeat', { required: true })}
            />
            {errors.newPassword?.type === 'required' && 'password is required'}
          </div>
          <div>
            <input
              className={buttonStyle(isValid)}
              type="submit"
              value="ResetPassword"
            />
          </div>
        </form>
      ) : (
        <p>not allowed</p>
      )}
    </>
  );
};

export default ResetPassword;
