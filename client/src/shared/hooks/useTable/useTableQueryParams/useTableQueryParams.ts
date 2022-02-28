import { Draft } from 'immer';
import { FilterCriteria } from 'src/component/filter/interfaces/FilterCriteria';
import { PaginationCriteria } from 'src/utils/RequestPagination';
import { OrderByEnum, SortCriteria } from 'types/api/SortCriteria';
import {
  useQueryParams,
  UseQueryParamsFn,
} from '../../useQueryParams/useQueryParams';

export type TableQueryParams<OrderBy> = PaginationCriteria &
  Partial<SortCriteria<OrderBy>> &
  FilterCriteria;

export type UseTableQueryParams<OrderBy> = {
  sortTable: (sortBy: OrderByEnum, orderColumn: OrderBy) => void;

  changePage: (page: number) => void;

  changeItemsPerPage: (itemsPerPage: number) => void;

  changePagination: (page: number, itemsPerPage: number) => void;

  setFilter: (filter: FilterCriteria) => void;

  resetPagination: () => void;
} & UseQueryParamsFn<TableQueryParams<OrderBy>>;

export const useTableQueryParams = <OrderBy>(
  defaultParams: TableQueryParams<OrderBy>
): [TableQueryParams<OrderBy>, UseTableQueryParams<OrderBy>] => {
  const [
    params,
    { getUrlWithQueryParams, setQueryParams, resetQueryParams, refreshParams },
  ] = useQueryParams(defaultParams);

  console.log(defaultParams, 'defaultParams');

  const sortTable = (orderBy: OrderByEnum, orderColumn: OrderBy) => {
    setQueryParams((state: Draft<TableQueryParams<OrderBy>>) => {
      //@ts-expect-error
      state.orderBy = orderBy;
      // @ts-expect-error
      state.orderColumn = orderColumn;
      state.page = 0;
    });
  };

  const changePage = (page: number) => {
    setQueryParams((state: Draft<TableQueryParams<OrderBy>>) => {
      state.page = page;
    });
  };

  const changeItemsPerPage = (itemsPerPage: number) => {
    setQueryParams((state: Draft<TableQueryParams<OrderBy>>) => {
      state.perPage = itemsPerPage;
    });
  };

  const changePagination = (page: number, itemsPerPage: number) => {
    setQueryParams((state: Draft<TableQueryParams<OrderBy>>) => {
      state.perPage = itemsPerPage;
      state.page = page;
    });
  };

  const setFilter = (filter: FilterCriteria) => {
    setQueryParams((state: Draft<TableQueryParams<OrderBy>>) => {
      (Object.keys(filter) as Array<keyof FilterCriteria>).forEach(
        (key: keyof FilterCriteria) => {
          (state as any)[key] = filter[key];
        }
      );

      state.page = 0;
    });
  };

  const resetPagination = () => {
    resetQueryParams({
      page: 0,
      perPage: params.perPage,
    });
  };

  return [
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
  ];
};
