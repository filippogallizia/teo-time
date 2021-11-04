import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserType } from '../../../../../../../types/Types';
import {
  ITALIC,
  MEDIUM_MARGIN_BOTTOM,
} from '../../../../shared/locales/constant';
import { HOUR_MINUTE_FORMAT } from '../../../../shared/locales/utils';
import { Actions, BookingAndUser } from '../../../booking/bookingReducer';
import { deleteBooking } from '../../../user/service/userService';

const EditBooking = ({
  oneBooking,
  setForceRender,
}: {
  oneBooking: AllBookingInfo;
  setForceRender: Dispatch<SetStateAction<number>>;
}) => {
  const handleDelete = async () => {
    try {
      await deleteBooking(
        (response: any) => {
          console.log(response);
        },
        { start: oneBooking.start, end: oneBooking.end }
      );
      setForceRender((prev: number) => prev + 1);
      toast.success('prenotazione cancellata', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-2 place-items-start">
      <div className="flex justify-center items-center rounded-full p-2 bg-green-500  w-1/2">
        <p className="cursor-pointer self-auto">Reschedule</p>
      </div>
      <div
        onClick={handleDelete}
        className="flex justify-center items-center rounded-full p-2 bg-yellow-500  w-1/2"
      >
        <p className="cursor-pointer self-auto">Cancella</p>
      </div>
    </div>
  );
};

type AllBookingInfo = {
  open: boolean;
} & BookingAndUser;

const DetailedInfoBooking = ({
  booking,
  setForceRender,
}: {
  booking: BookingAndUser[];
  setForceRender: Dispatch<SetStateAction<number>>;
}) => {
  const [allBookingInfo, setAllBookingInfo] = useState<Array<AllBookingInfo>>(
    []
  );

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
      {allBookingInfo.map((l: BookingAndUser, i: number) => {
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
              {allBookingInfo[i].open && (
                <EditBooking
                  oneBooking={allBookingInfo[i]}
                  setForceRender={setForceRender}
                />
              )}
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
};
export default DetailedInfoBooking;
