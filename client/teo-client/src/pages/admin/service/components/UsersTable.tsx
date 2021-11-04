import React from 'react';
import { useSortBy, useTable } from 'react-table';
import { BookingComponentType } from '../../../booking/BookingPageTypes';
import { InitialState } from '../../../booking/bookingReducer';

const UsersTable = ({ state }: { state: InitialState }) => {
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
    return state.schedules.allBookingsAndUsers
      .map((usr) => {
        return usr.map((innerUser) => {
          return {
            col1: innerUser.user.name,
            col2: innerUser.user.email,
            col3: innerUser.user.phoneNumber,
          };
        });
      })
      .flat(1);
  }, [state.schedules.allBookingsAndUsers]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    //@ts-expect-error
    useTable({ columns, data }, useSortBy);

  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
};

export default UsersTable;
