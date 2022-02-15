import React, { useEffect, useState } from 'react';
import { Column } from 'react-table';
import { UserType } from '../../../../types/Types';
import i18n from '../../../i18n';
import AdminPageApi from '../adminPages/listBookingsManager/ListBookingsManagerApi';
import Table from './table/Table';

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

  return users.length === 0 ? (
    <div className="text-center">
      <p>{i18n.t('adminPage.userInfoPage.noUsers')}</p>
    </div>
  ) : (
    <Table columns={columns} data={data} />
  );
};

export default UsersTable;
