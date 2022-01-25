import produce from 'immer';
import { useEffect, useMemo, useReducer } from 'react';
import { TokenType, UserType } from '../../../types/Types';
import SessionService from '../../services/SessionService';
import {
  AuthContext,
  AuthContextState,
  initialState,
} from '../authContext/AuthContext';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';

export type SetTokenAction = {
  type: typeof SET_TOKEN;
  payload: TokenType;
};

export type SetUserAction = {
  type: typeof SET_USER;
  payload: UserType;
};

type State = {} & AuthContextState;

type Action = SetTokenAction | SetUserAction;

const userContextReducer = produce((draft: State, action: Action) => {
  switch (action.type) {
    case SET_TOKEN:
      draft.token = action.payload;
      break;

    case SET_USER:
      draft.user = action.payload;
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

  useEffect(() => {
    SessionService.onSetToken(setToken);
    SessionService.onSetUser(setUser);
  }, []);

  const contextValue: AuthContextState = useMemo(
    () => ({
      token,
      user,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default Authentication;
