import {
  useSortBy,
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
} from 'react-table';

import PaginationButton from './components/PaginationButton';

const Table = ({ columns, data }: any) => {
  const objectTable = useTable(
    {
      columns,
      data,
      //@ts-expect-error
      initialState: { pageIndex: 0 },
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination // new
  );

  const {
    page,
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    setPageSize,
    pageSize,
    state,
  } = objectTable as any;
  console.log(pageSize, 'pagesize');

  return (
    <div className="max-w-sm md:max-w-none">
      <div className="mt-2 flex flex-col overflow-auto">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <table
              {...objectTable.getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                {objectTable.headerGroups.map((headerGroup: any) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column: any) => (
                      // Add the sorting props to control sorting. For this example
                      // we can add them into the header props
                      <th
                        scope="col"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.render('Header')}
                        {/* Add a sort direction indicator */}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...objectTable.getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {page.map((row: any, i: number) => {
                  objectTable.prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell: any) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="m-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1 items-center">
            <PaginationButton
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              buttonText={'<<'}
            />
            <PaginationButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              buttonText={'<'}
            />
            <PaginationButton
              onClick={() => nextPage()}
              disabled={!canNextPage}
              buttonText={'>'}
            />
            <PaginationButton
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              buttonText={'>>'}
            />
          </div>
          <div className="flex gap-2">
            <div>
              <p>
                {state.pageIndex + 1} of {pageOptions.length}
              </p>
            </div>
            <select
              className="bg-white border-2"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pSize) => (
                <option key={pSize} value={pSize}>
                  {pSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
