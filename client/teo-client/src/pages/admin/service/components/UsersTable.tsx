import React, { useEffect, useState } from 'react';
import { useAsyncDebounce, useSortBy, useTable } from 'react-table';
import { UserType } from '../../../../../../../types/Types';
import { InitialState } from '../../../booking/bookingReducer';
import { getAllUsers } from '../AdminPageService';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
}

const UsersTable = () => {
  const [data1, setData] = useState<UserType[]>([]);
  useEffect(() => {
    const handleSuccess = (res: any) => {
      console.log(res);
      setData(res);
    };
    getAllUsers(handleSuccess);
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Email',
        accessor: 'col2',
      },
      {
        Header: 'PhoneNumber',
        accessor: 'col3',
      },
    ],
    []
  );
  const data = React.useMemo(() => {
    return data1
      .map((usr) => {
        return {
          col1: usr.name,
          col2: usr.email,
          col3: usr.phoneNumber,
        };
      })
      .flat(1);
  }, [data1]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    //@ts-expect-error
    useTable({ columns, data }, useSortBy);

  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"></div>
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup: any) => (
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
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {firstPageRows.map((row: any, i: number) => {
                  prepareRow(row);
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
    </>
  );
};

export default UsersTable;
