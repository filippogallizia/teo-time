import { TokenType, UserType } from '../../types/Types';
import { LoginResponseType } from '../pages/auth/AuthApi/LoginService';
import { ACCESS_TOKEN, USER_INFO } from '../constants/constant';
import HttpService from './HttpService';
import LocalStorageManager from '../services/StorageService';

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

  public onSetLogout(onLogout: SetLogout) {
    this._onLogout = onLogout;
  }

  public login({ token, user }: LoginResponseType) {
    HttpService.accessToken = token ?? '';
    LocalStorageManager.setItem(ACCESS_TOKEN, token);
    LocalStorageManager.setItem(USER_INFO, user);
    this._setUser(user);
    this.setToken(token);
  }

  public refreshToken(token: string) {
    LocalStorageManager.removeItem(ACCESS_TOKEN);
    LocalStorageManager.setItem(ACCESS_TOKEN, token);
    this.setToken(token);
  }

  public getToken() {
    try {
      const token: string | null = localStorage.getItem(ACCESS_TOKEN);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  private setToken(token: string) {
    console.log(typeof token, 'here');
    HttpService.accessToken = token.toString() ?? '';
    //this._setToken(token);
    console.log(HttpService.accessToken, 'accessToken httpservice');
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
    LocalStorageManager.removeItem(ACCESS_TOKEN);
    LocalStorageManager.removeItem(USER_INFO);
    this._onLogout();
  }
  public authentication() {
    const token: string | null = LocalStorageManager.getItem(ACCESS_TOKEN);
    this.setToken(token ?? '');
  }
}

export default new SessionService();
