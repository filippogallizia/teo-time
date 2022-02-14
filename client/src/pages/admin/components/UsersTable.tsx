import React, { useEffect, useState } from 'react';
import {
  useSortBy,
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  Column,
} from 'react-table';
import { UserType } from '../../../../types/Types';
import i18n from '../../../i18n';
import AdminPageApi from '../adminPages/listBookingsManager/ListBookingsManagerApi';

const UsersTable = () => {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const asyncFn = async () => {
      const response = await AdminPageApi.getAllUsers();
      setUsers(response);
    };
    asyncFn();
  }, []);

  const columns: readonly Column<{
    col1: string | undefined;
    col2: string | undefined;
    col3: number | undefined;
  }>[] = React.useMemo(
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
    return users
      .map((usr) => {
        return {
          col1: usr.name,
          col2: usr.email,
          col3: usr.phoneNumber,
        };
      })
      .flat(1);
  }, [users]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useFilters, // useFilters!
      useGlobalFilter,
      useSortBy,
      usePagination // new
    );

  const firstPageRows = rows.slice(0, 20);

  return users.length === 0 ? (
    <div className="text-center">
      <p>{i18n.t('adminPage.userInfoPage.noUsers')}</p>
    </div>
  ) : (
    <div className="max-w-sm md:max-w-none">
      <div className="mt-2 flex flex-col overflow-auto">
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
    </div>
  );
};

export default UsersTable;
