import axios from 'axios';
import { TokenType, UserType } from '../../../../types/Types';
import { ENDPOINT } from '../../../api';
import HttpService from '../../../services/HttpService';

class AuthApi {
  public signup(body: {
    email: string;
    name: string;
    password: any;
    phoneNumber: number;
  }): Promise<any> {
    const { email, name, password, phoneNumber } = body;
    return HttpService.post(`/signup`, {
      email,
      name,
      password,
      phoneNumber,
    });
  }

  public login(body: { email: string; password: any }): Promise<any> {
    const { email, password } = body;
    return HttpService.post(`/login`, {
      email,
      password,
    });
  }

  public resetPassword(body: { email: string }): Promise<any> {
    const { email } = body;
    return HttpService.post(`/password/reset`, {
      email,
    });
  }

  public postOtpForVerification(body: {
    resetPasswordToken: string;
  }): Promise<any> {
    const { resetPasswordToken } = body;
    return HttpService.post(`/password/otp`, {
      resetPasswordToken,
    });
  }

  public postNewPassword(body: {
    resetPasswordToken: string | null;
    newPassword: string;
  }): Promise<any> {
    const { resetPasswordToken, newPassword } = body;
    return HttpService.post(`/password/new`, {
      resetPasswordToken,
      newPassword,
    });
  }

  public postEmailForResetPassword(body: { email: string }): Promise<any> {
    const { email } = body;
    return HttpService.post(`/password/reset`, {
      email,
    });
  }
}

export type LoginResponseType = {
  token: TokenType;
  user: UserType;
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

export default new AuthApi();
