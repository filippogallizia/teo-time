import { createContext } from 'react';
import { TokenType, UserType } from '../../types/Types';
import userService from './authentication/user/UserService';

export type AuthContextState = {
  token: TokenType;
  user: UserType;
};

export const initialState = {
  token: '',
  user: new userService(),
};

export const AuthContext = createContext<AuthContextState>(initialState);
