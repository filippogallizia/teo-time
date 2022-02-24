import { useMemo } from 'react';

import produce, { nothing, Draft } from 'immer';
import { useHistory, useLocation } from 'react-router';
import { parseSearch } from '../../../../utils/UrlUtils';
import { HttpUtils } from '../../../../utils/httpUtils';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type ValidRecipeReturnType<State> =
  | State
  | void
  | undefined
  | (State extends undefined ? typeof nothing : never);

const getParams = <T extends object = object>(
  search: string,
  defaultParams: T
) => {
  const params = parseSearch<T>(search);

  return {
    ...defaultParams,
    ...params,
  };
};

export type UseQueryParamsFn<T extends object = object> = {
  /**
   * Gets Url with QueryParams
   */
  getUrlWithQueryParams: (state: T) => string;
  /**
   * Function to change QueryParams
   */
  setQueryParams: (
    queryParams: (draft: Draft<T>) => ValidRecipeReturnType<Draft<T>>
  ) => void;
  /**
   * Function reset/add QueryParams
   */
  resetQueryParams: (newResetParams?: T) => void;
  /**
   * Function reset/add QueryParams
   */
  refreshParams: (pathname: string, search: string) => void;
};

export const useQueryParams = <T extends object = object>(
  defaultParams: T
): [T, UseQueryParamsFn<T>] => {
  const { search, pathname } = useLocation();
  const { push } = useHistory();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => getParams(search, defaultParams), [search]);

  const getUrlWithQueryParams = (state: T) => {
    const params: string = HttpUtils.serializeParams(state);

    return `${pathname}${params}`;
  };

  const onSetParams = (state: T) => {
    push(getUrlWithQueryParams(state));
  };

  const setQueryParams = (
    queryParams: (draft: Draft<T>) => ValidRecipeReturnType<Draft<T>>
  ) => {
    const state: T = produce(params, queryParams);

    onSetParams(state);
  };

  const resetQueryParams = (newResetParams?: T) => {
    const state: T = {
      ...(getParams('', defaultParams) ?? {}),
      ...(newResetParams ?? {}),
    };

    onSetParams(state);
  };

  const refreshParams = (pathname: string, search: string) => {
    const params: string = HttpUtils.serializeParams(
      getParams(search, defaultParams)
    );

    push(`${pathname}${params}`);
  };

  return [
    params,
    {
      getUrlWithQueryParams,
      setQueryParams,
      resetQueryParams,
      refreshParams,
    },
  ];
};
