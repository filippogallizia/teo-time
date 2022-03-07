import produce from 'immer';
import { Draft } from 'immer/dist/internal';
import { useReducer, useRef } from 'react';
import { PaginationCriteria } from 'src/utils/RequestPagination';
import { useTableQueryParams } from './useTableQueryParams/useTableQueryParams';

export type OutputPagination = {
  pageSize: number;
  pageNumber: number;
  hasNextPage: boolean;
  totalItems?: number;
};
export class RequestPagination {
  public totalItems: number = 0;

  public pagination: PaginationCriteria = {
    page: 0,
    perPage: 20,
  };

  public setPaginationByOutputPagination(outputPagination: OutputPagination) {
    this.totalItems = outputPagination.totalItems ?? 0;
  }
}

export type Reducer<S = any, A extends Action = PayloadAction> = (
  state: S,
  action: A
) => void;

export interface Action<T = any> {
  type: T;
}

export interface PayloadActionWithAction<
  T = any,
  Payload extends object = object
> extends Action<T> {
  payload: {
    [Key in keyof Payload]: Payload[Key];
  };
}
export interface PayloadActionWithoutAction<T = any> extends Action<T> {}

export type PayloadAction<
  T = any,
  Payload extends object | undefined = undefined
> = Payload extends object
  ? PayloadActionWithAction<T, Payload>
  : PayloadActionWithoutAction<T>;

export const useTable = <
  State extends Draft<object>,
  Action extends PayloadAction
>(
  reducer: Reducer<State, Action>,
  initialState: State
) => {
  const paginationRef = useRef(new RequestPagination());

  const [
    params,
    {
      // #region useQueryParams functions
      getUrlWithQueryParams,
      setQueryParams,
      refreshParams,
      resetQueryParams,
      // #endregion useQueryParams functions

      sortTable,
      changePage,
      changeItemsPerPage,
      changePagination,
      setFilter,
      resetPagination,
    },
  ] = useTableQueryParams(paginationRef.current.pagination);

  const { page } = params;

  paginationRef.current.pagination.page = page;

  const reducerInside = () => {
    return produce((draft: Draft<State>, action: Action) => {
      //@ts-expect-error
      if (action.payload && action.payload.pagination) {
        paginationRef.current.setPaginationByOutputPagination(
          //@ts-expect-error
          action.payload.pagination
        );
      }
      // @ts-expect-error
      reducer(draft, action);
    }, initialState);
  };
  const [state, dispatch] = useReducer(reducerInside(), initialState);

  return { ...state, pagination: paginationRef.current, changePage, dispatch };
};
