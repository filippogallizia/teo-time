import React, { useEffect, useState } from 'react';
import AdminPageApi from './ListBookingsManagerApi';
import { UserType } from '../../../../../types/Types';
import i18n from '../../../../i18n';
import FixedBookingsManagerApi from '../fixedBookingsManager/FixedBookingsManagerApi';
import { mapFixedBookings } from './helpers/helpers';
import { Column } from 'react-table';
import Table from '../../components/table/Table';
import ToastService from '../../../../services/ToastService';
import { DateTime } from 'luxon';
import DatePicker from 'react-date-picker';

export type BookingsAndUsersType = {
  id: number;
  start: string;
  end: string;
  userId: number;
  user: UserType;
}[];

const createStartAndEndDate = (date: Date) => {
  return {
    startDate: DateTime.fromJSDate(date)
      .set({
        hour: 0,
        minute: 0,
        millisecond: 0,
      })
      .toJSDate(),
    endDate: DateTime.fromJSDate(date)
      .set({
        hour: 23,
        minute: 0,
        millisecond: 0,
      })
      .toJSDate(),
  };
};

const ListBookingsManager = () => {
  const [bookings, setBookings] = useState<BookingsAndUsersType>([]);
  const [filterData, setFilterData] = useState<Date>();

  const startEnd = filterData && createStartAndEndDate(filterData);

  const fetchAndSetBookings = async () => {
    try {
      const handleSuccess = (response: any) => {
        if (response && response.length > 0) {
          setBookings(response);
        } else {
          setBookings([]);
        }
      };
      const bookingResponse = await AdminPageApi.getUsersAndBookings({
        startDate: filterData && createStartAndEndDate(filterData).startDate,
        endDate: filterData && createStartAndEndDate(filterData).endDate,
      });

      const fixedBookingResponse =
        await FixedBookingsManagerApi.getFixedBookings('start');

      const mappedFixedBooking = mapFixedBookings(fixedBookingResponse);

      const allBookingsSorted = [...bookingResponse, ...mappedFixedBooking]
        .filter((item) => {
          return new Date(item.start) >= new Date();
        })
        .sort((item1, item2) => {
          //@ts-expect-error
          return new Date(item1.start) - new Date(item2.start);
        });

      handleSuccess(allBookingsSorted);
    } catch (e) {
      ToastService.error(e);
    }
  };

  //TODO -> delete past bookings

  useEffect(() => {
    fetchAndSetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const columns: readonly Column<{
    col1: string | undefined;
    col2: string | undefined;
    col3: string | undefined;
  }>[] = React.useMemo(
    () => [
      {
        Header: 'Ora Inizio',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Cliente',
        accessor: 'col2',
      },
      {
        Header: 'Tel',
        accessor: 'col3',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return bookings
      .map((book) => {
        console.log(book?.user?.name, 'book?.user?.name');
        return {
          col1: DateTime.fromISO(book.start).toFormat('LLL dd t'),
          col2: book?.user?.name ?? 'No name',
          col3: book?.user?.phoneNumber ?? 'No tel',
        };
      })
      .flat(1);
  }, [bookings]);

  return (
    <div>
      <div>
        <DatePicker
          name="prova"
          value={filterData}
          onChange={(e: Date) => {
            setFilterData(e);
          }}
        />
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default ListBookingsManager;
