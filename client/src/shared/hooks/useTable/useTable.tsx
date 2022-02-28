import { PaginationCriteria } from 'src/utils/RequestPagination';
import { useTableQueryParams } from './useTableQueryParams/useTableQueryParams';

export class RequestPagination {
  public pagination: PaginationCriteria = {
    page: 0,
    perPage: 20,
  };
}

type UseTable = {
  dispatch: any;
  initialState: { perPage: number };
};

export const useTable = ({ dispatch }: UseTable) => {
  const pagination = new RequestPagination();

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
  ] = useTableQueryParams(pagination.pagination);

  console.log(params, 'params');

  const { page } = params;

  console.log(page, 'page');

  pagination.pagination.page = page;

  return changePage;
};
