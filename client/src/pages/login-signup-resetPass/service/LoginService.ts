import axios from 'axios';
import { TokenType, UserType } from '../../../../types/Types';
import { ENDPOINT } from '../../../api';

export const signupService = async (
  fn: any,
  body: { email: string; name: string; password: any; phoneNumber: number }
) => {
  try {
    const { email, name, password, phoneNumber } = body;
    const response = await axios.post(`${ENDPOINT}/signup`, {
      email,
      name,
      password,
      phoneNumber,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export type LoginResponseType = {
  token: TokenType;
  user: UserType;
};

export const loginService = async (
  fn: (response: any) => void,
  body: { email: string; password: any }
): Promise<void> => {
  try {
    const { email, password } = body;
    const response = await axios.post(`${ENDPOINT}/login`, {
      email,
      password,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const googleLoginService = async (fn: any, body: { token: string }) => {
  try {
    const { token } = body;
    const response = await axios({
      method: 'get',
      url: `${ENDPOINT}/google-login`,
      headers: {
        Authorization: `Bearer ${token})}`,
      },
      data: {
        workSettings: body,
      },
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const googleCalendarInsertEvent = async (
  fn: any,
  body: {
    token: string | null;
    event: any;
  },
  userId?: string
) => {
  try {
    const { token, event } = body;
    const response = await axios({
      method: 'post',
      url: `https://www.googleapis.com/calendar/v3/calendars/${(userId =
        'primary')}/events`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // data: {
      //   end: {
      //     dateTime: '2022-05-28T17:00:00-07:00',
      //   },
      //   start: {
      //     dateTime: '2022-05-28T09:00:00-07:00',
      //   },
      // },
      data: {
        ...event,
      },
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const googleCalendarList = async (
  fn: any,
  body: { token: string | null }
) => {
  try {
    const { token } = body;
    const response = await axios({
      method: 'get',
      url: `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        workSettings: body,
      },
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const resetPassword = async (fn: any, body: { email: string }) => {
  const { email } = body;
  try {
    const response = await axios.post(`${ENDPOINT}/resetPassword`, {
      email,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const postOtpForVerification = async (
  fn: any,
  body: { resetPasswordToken: string }
) => {
  try {
    const { resetPasswordToken } = body;
    const response = await axios.post(`${ENDPOINT}/password/otp`, {
      resetPasswordToken,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const postNewPassword = async (
  fn: any,
  body: { resetPasswordToken: string | null; newPassword: string }
) => {
  try {
    const { resetPasswordToken, newPassword } = body;
    const response = await axios.post(`${ENDPOINT}/password/newPassword`, {
      resetPasswordToken,
      newPassword,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};

export const postEmailForResetPassword = async (
  fn: any,
  body: { email: string }
) => {
  try {
    const { email } = body;
    const response = await axios.post(`${ENDPOINT}/resetPassword`, {
      email,
    });
    fn(response.data);
  } catch (e: any) {
    throw e;
  }
};
