import produce from 'immer';
import { useEffect, useMemo, useReducer } from 'react';
import { TokenType, UserType } from '../../../types/Types';
import userService from './user/UserService';
import SessionService from '../../services/SessionService';
import {
  AuthContext,
  AuthContextState,
  initialState,
} from '../authContext/AuthContext';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const LOG_OUT = 'LOG_OUT';

export type SetTokenAction = {
  type: typeof SET_TOKEN;
  payload: TokenType;
};

export type SetUserAction = {
  type: typeof SET_USER;
  payload: UserType;
};

export type SetLogOutAction = {
  type: typeof LOG_OUT;
};

type State = {} & AuthContextState;

type Action = SetTokenAction | SetUserAction | SetLogOutAction;

const userContextReducer = produce((draft: State, action: Action) => {
  switch (action.type) {
    case SET_TOKEN:
      draft.token = action.payload;
      break;

    case SET_USER:
      draft.user = action.payload;
      break;

    case LOG_OUT:
      draft.token = '';
      draft.user = new userService();
  }
});

type Props = {
  children: React.ReactNode;
};

const Authentication = ({ children }: Props) => {
  const [{ token, user }, dispatch] = useReducer(
    userContextReducer,
    initialState
  );

  const setToken = (payload: TokenType) => {
    dispatch({
      type: SET_TOKEN,
      payload: payload,
    });
  };

  const setUser = (payload: UserType) => {
    dispatch({
      type: SET_USER,
      payload: payload,
    });
  };

  const setLogout = () => {
    dispatch({ type: LOG_OUT });
  };

  useEffect(() => {
    SessionService.onSetToken(setToken);
    SessionService.onSetUser(setUser);
    SessionService.onSetLogout(setLogout);
    SessionService.authentication();
  }, []);

  const contextValue: AuthContextState = useMemo(
    () => ({
      token,
      user,
    }),
    [token, user]
  );

  console.log(token, 'token here22');

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default Authentication;
