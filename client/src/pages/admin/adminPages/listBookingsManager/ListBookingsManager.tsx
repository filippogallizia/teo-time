import React, { useEffect, useState } from 'react';
import AdminPageApi from './ListBookingsManagerApi';
import { UserType } from '../../../../../types/Types';
import FixedBookingsManagerApi, {
  FixedBookingDTO,
} from '../fixedBookingsManager/FixedBookingsManagerApi';
import {
  createFixedBoookingForAllYear,
  createStartAndEndDate,
  filterJustFutureDates,
  giveDateToFixBooking,
} from './helpers/helpers';
import { Column } from 'react-table';
import Table from '../../components/table/Table';
import ToastService from '../../../../services/ToastService';
import { DateTime } from 'luxon';
import DatePicker from 'react-date-picker';
import {
  DATE_TO_DAY_FORMAT,
  SET_DATE_TO_MIDNIGHT,
} from '../../../../helpers/utils';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';

export type BookingsAndUsersType = {
  id: number;
  start: string;
  end: string;
  userId: number;
  user: UserType;
};

const ListBookingsManager = () => {
  const [bookings, setBookings] = useState<
    Array<BookingsAndUsersType | FixedBookingDTO>
  >([]);
  const [fixedBookings, setFixedBookings] = useState<FixedBookingDTO[]>([]);
  const [filterData, setFilterData] = useState<Date>();

  const handleDelete = async (
    selectedBook: BookingsAndUsersType | FixedBookingDTO
  ) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      let isConfirmed = confirm('Sicuro di volere cancellare?');
      if (isConfirmed) {
        await AdminPageApi.deleteBooking({
          start: selectedBook.start,
          end: selectedBook.end,
        });
        fetchAndSetBookings();
        toast.success('prenotazione cancellata');
      }
    } catch (e) {
      ToastService.error(e);
    }
  };

  const fetchAndSetBookings = async () => {
    try {
      const handleSuccess = (response: any) => {
        if (response && response.length > 0) {
          setBookings(response);
        } else {
          setBookings([]);
        }
      };

      /**
       * fetch dynamic bookings with filters.
       */
      const bookingResponse = await AdminPageApi.getUsersAndBookings({
        start: filterData && createStartAndEndDate(filterData).start,
        end: filterData && createStartAndEndDate(filterData).end,
      });

      /**
       * if user filters, then filter fixedBookings
       */
      let final = fixedBookings;

      if (filterData) {
        final = fixedBookings.filter((day) => {
          const filterDataToString = DateTime.fromJSDate(filterData).toString();
          return (
            SET_DATE_TO_MIDNIGHT(day.start) ===
            SET_DATE_TO_MIDNIGHT(filterDataToString)
          );
        });
      }

      /**
       * here we filter for future dates and sort them in crescent order
       */
      const allBookingsSorted = [...bookingResponse, ...final]
        .filter((item) => filterJustFutureDates(item.start))
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
    const asyncFn = async () => {
      /**
       * get fixed bookings
       */
      const fixedBookingResponse =
        await FixedBookingsManagerApi.getFixedBookings();

      /**
       * fixedBooking comes with no date but just dayName => day: Monday
       * get the next 7 days from now and match them with fixedBooking's day
       * map fixedBooking with the new date retrived with new time.
       */
      const fixedBkgsWithCompleteDate =
        giveDateToFixBooking(fixedBookingResponse);

      /**
       * create  fixedBookingYearList and filter for exceptionDate
       */
      let fixedBookingYearList = createFixedBoookingForAllYear(
        fixedBkgsWithCompleteDate
      ).filter((bkg) => {
        return (
          DATE_TO_DAY_FORMAT(bkg.start) !==
          DATE_TO_DAY_FORMAT(bkg.exceptionDate)
        );
      });

      setFixedBookings(fixedBookingYearList);
    };
    asyncFn();
  }, []);

  useEffect(() => {
    fetchAndSetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, fixedBookings]);

  const columns: readonly Column<{
    col1: string | undefined;
    col2: string | undefined;
    col3: string | undefined;
    col4: string | undefined;
  }>[] = React.useMemo(
    () => [
      {
        Header: 'Ora Inizio',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Email',
        accessor: 'col2',
      },
      {
        Header: 'Tel',
        accessor: 'col3',
      },
      {
        Header: 'Delete',
        accessor: 'col4',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return bookings
      .map((book: any) => {
        return {
          col1: DateTime.fromISO(book?.start).toFormat('LLL dd t'),
          col2: book?.user?.email ?? book?.email,
          col3: book?.user?.phoneNumber ?? 'No tel',
          col4: (
            <div className="cursor-pointer">
              {!Object.keys(book).includes('exceptionDate') && (
                <AiFillDelete
                  onClick={() => {
                    handleDelete(book);
                  }}
                />
              )}
            </div>
          ),
        };
      })
      .flat(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
