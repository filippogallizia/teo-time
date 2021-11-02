import React, { useEffect, useState } from 'react';
import {
  ITALIC,
  MEDIUM_MARGIN_BOTTOM,
} from '../../../../shared/locales/constant';
import { HOUR_MINUTE_FORMAT } from '../../../../shared/locales/utils';

const EditBooking = () => {
  return (
    <div className="grid grid-cols-1 gap-2 place-items-start">
      <div className="flex justify-center items-center rounded-full p-2 bg-green-500  w-1/2">
        <p className="cursor-pointer self-auto">Reschedule</p>
      </div>
      <div className="flex justify-center items-center rounded-full p-2 bg-yellow-500  w-1/2">
        <p className="cursor-pointer self-auto">Cancella</p>
      </div>
    </div>
  );
};

const DetailedInfoBooking = ({ booking, ind }: any) => {
  const [allBookingInfo, setAllBookingInfo] = useState<any>([]);

  useEffect(() => {
    const addOpenProp = booking.map((a: any) => {
      return {
        ...a,
        open: false,
      };
    });
    setAllBookingInfo(addOpenProp);
  }, [booking]);

  return (
    <div className="">
      {allBookingInfo.map((l: any, i: number) => {
        const { start, user } = l;
        return (
          <div
            key={start}
            className={`grid grid-cols-5 gap-4 ${MEDIUM_MARGIN_BOTTOM}`}
          >
            <div className="col-span-2 grid grid-cols-1 gap-4 content-start">
              <div className="grid grid-cols-2 gap-0">
                <div className="rounded-full h-7 w-7 bg-yellow-500"></div>
                <p>{HOUR_MINUTE_FORMAT(start)}</p>
              </div>
              {allBookingInfo[i].open && <EditBooking />}
            </div>
            <div className="col-span-2 grid grid-cols-1 gap-4">
              <div>
                <p>{user.name}</p>
              </div>
              {allBookingInfo[i].open && (
                <>
                  <div>
                    <p className={ITALIC}>Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <p className={ITALIC}>Luogo</p>
                    <p>milano</p>
                  </div>
                  <div>
                    <p className={ITALIC}>Telefono</p>
                    <p>{user.phoneNumber}</p>
                  </div>
                </>
              )}
            </div>
            <div
              className="col-span-1 cursor-pointer font-serif"
              onClick={() => {
                setAllBookingInfo((prev: any) => {
                  const mutation = [...prev];
                  mutation[i] = {
                    ...mutation[i],
                    open: !mutation[i].open,
                  };
                  return mutation;
                });
              }}
            >
              Details
            </div>
          </div>
        );
      })}
    </div>
  );
  // return (

  //   <div className="grid grid-cols-3 gap-4  border-2 border-gray-300">
  //     <div className="col-span-3">
  //       <p>{DATE_TO_CLIENT_FORMAT(start)}</p>
  //     </div>
  //     <div className="col-span-1 grid grid-cols-1 gap-4 content-start">
  //       <div className="grid grid-cols-2 gap-0">
  //         <div className="rounded-full h-7 w-7 bg-yellow-500"></div>
  //         <p>{HOUR_MINUTE_FORMAT(start)}</p>
  //       </div>
  //       {isSectionDetailsOpen && <EditBooking />}
  //     </div>
  //     <div className="col-span-1 grid grid-cols-1 gap-4">
  //       <div className={BOLD}>{/* <p>{user.name}</p> */}</div>
  //       {isSectionDetailsOpen && (
  //         <>
  //           <div>
  //             <p className={BOLD}>EMAIL</p>
  //             <p>{user.email}</p>
  //           </div>
  //           <div>
  //             <p className={BOLD}>LOCATION</p>
  //             <p>milano</p>
  //           </div>
  //           <div>
  //             <p className={BOLD}>TELEFONO</p>
  //             <p>{user.phoneNumber}</p>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //     <div
  //       className=" col-span-1 cursor-pointer"
  //       onClick={() => setSectionDetails((prev) => !prev)}
  //     >
  //       --Details
  //     </div>
  //   </div>
  // );
};

// function DetailedInfoBooking({ dispatch, state }: BookingComponentType) {
//   const data = React.useMemo(() => {
//     return state.schedules.allBookingsAndUsers.map((user) => {
//       return {
//         col1: user.name,
//         col2: user.email,
//         col3: user.phoneNumber,
//       };
//     });
//   }, [state.schedules.allBookingsAndUsers]);

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: 'Name',
//         accessor: 'col1', // accessor is the "key" in the data
//       },
//       {
//         Header: 'Email',
//         accessor: 'col2',
//       },
//       {
//         Header: 'PhoneNumber',
//         accessor: 'col3',
//       },
//     ],
//     []
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     //@ts-expect-error
//     useTable({ columns, data }, useSortBy);

//   const firstPageRows = rows.slice(0, 20);

//   return (
//     <>
//       <table {...getTableProps()}>
//         <thead>
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column: any) => (
//                 // Add the sorting props to control sorting. For this example
//                 // we can add them into the header props
//                 <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                   {column.render('Header')}
//                   {/* Add a sort direction indicator */}
//                   <span>
//                     {column.isSorted
//                       ? column.isSortedDesc
//                         ? ' 🔽'
//                         : ' 🔼'
//                       : ''}
//                   </span>
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {firstPageRows.map((row, i) => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map((cell) => {
//                   return (
//                     <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <br />
//       <div>Showing the first 20 results of {rows.length} rows</div>
//     </>
//   );
// }

export default DetailedInfoBooking;
