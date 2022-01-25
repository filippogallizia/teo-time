import { TokenType, UserType } from '../../types/Types';
import { LoginResponseType } from '../pages/auth/AuthApi/LoginService';
import { ACCESS_TOKEN, USER_INFO } from '../shared/locales/constant';
import HttpService from './HttpService';

export type SetTokenType = (token: TokenType) => void;
export type SetUserType = (user: UserType) => void;

export type SetLogout = () => void;

class SessionService {
  protected _setToken: SetTokenType = () => {};
  protected _setUser: SetUserType = () => {};
  protected _onLogout: SetLogout = () => {};

  public onSetToken(setToken: SetTokenType) {
    this._setToken = setToken;
  }

  public onSetUser(setUser: SetUserType) {
    this._setUser = setUser;
  }

  public login({ token, user }: LoginResponseType) {
    HttpService.accessToken = token ?? '';
    localStorage.setItem(ACCESS_TOKEN, token);
    localStorage.setItem(USER_INFO, JSON.stringify(user));
  }

  public refreshToken(token: string) {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  public getToken() {
    try {
      const token: string | null = localStorage.getItem(ACCESS_TOKEN);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  public getUser() {
    try {
      const userJsonFormat: string | null = localStorage.getItem(USER_INFO);
      const user: UserType = userJsonFormat && JSON.parse(userJsonFormat);
      return user;
    } catch (e) {
      console.log(e);
    }
  }

  public logOut() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER_INFO);
  }
}

export default new SessionService();
