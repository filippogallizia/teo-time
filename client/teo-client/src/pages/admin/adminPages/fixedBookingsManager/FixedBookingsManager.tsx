import { BookingComponentType } from '../../../booking/BookingPageTypes';
import {
  Actions,
  ADD,
  ADD_OR_REMOVE_FIXED_BKS,
  DELETE,
  FixedBookType,
  SET_FIXED_BKS,
  UPLOAD_EMAIL_CLIENT,
  UPLOAD_END_DATE,
  UPLOAD_START_DATE,
} from '../../../booking/stateReducer';
import { BOLD, ITALIC } from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';

import CardComponent from '../../components/Card';
import i18n from '../../../../i18n';
import { Dispatch, useEffect } from 'react';
import { handleToastInFailRequest } from '../../../../shared/locales/utils';
import { toast } from 'react-toastify';
import { getFixedBookings } from './fixedBookingsManagerService';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type BookDetailsType = {
  bks: FixedBookType;
  day: string;
  dispatch: Dispatch<Actions>;
};

const BookDetails = ({ dispatch, bks, day }: BookDetailsType) => {
  console.log(bks.start, 'bks start');
  return (
    <div className={`grid grid-cols-3 gap-4`}>
      <p className={`col-span-3 ${ITALIC}`}>
        {/*{i18n.t('adminPage.avalManagerPage.workingTime')}
         */}
        cliente
      </p>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <p>{i18n.t('adminPage.avalManagerPage.start')}</p>
        <input
          type="time"
          id="workTimeRange.start"
          className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.start}
          onChange={(e) => {
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  ...bks,
                  start: e.target.value,
                },
                type: UPLOAD_START_DATE,
              },
            });
          }}
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <p>{i18n.t('adminPage.avalManagerPage.end')}</p>
        <input
          type="time"
          id="workTimeRange.end"
          className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.end}
          onChange={(e) => {
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  ...bks,
                  end: e.target.value,
                },
                type: UPLOAD_END_DATE,
              },
            });
          }}
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 items-center">
        <p>Email cliente</p>
        <input
          type="text"
          id="clientName"
          className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          value={bks.email}
          onChange={(e) => {
            dispatch({
              type: ADD_OR_REMOVE_FIXED_BKS,
              payload: {
                day: day,
                booking: {
                  ...bks,
                  email: e.target.value,
                },
                type: UPLOAD_EMAIL_CLIENT,
              },
            });
          }}
        />
      </div>
      <GeneralButton
        buttonText="-"
        onClick={() => {
          dispatch({
            type: ADD_OR_REMOVE_FIXED_BKS,
            payload: {
              day: day,
              booking: {
                id: bks.id,
                start: '',
                end: '',
                email: '',
              },
              type: DELETE,
            },
          });
        }}
      />
    </div>
  );
};

const FixedBksManager = ({ dispatch, state }: BookingComponentType) => {
  useEffect(() => {
    const asyncFn = async () => {
      const handleSuccess = (res: any) => {
        dispatch({ type: SET_FIXED_BKS, payload: res });
        console.log(res);
      };
      await getFixedBookings(handleSuccess);
    };
    asyncFn();
  }, [dispatch]);

  return (
    <div className=" grid grid-cols-1 gap-8 overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {weekDays.map((day: string) => {
          const matchedDay = state.schedules.fixedBks.filter(
            (d) => d.day === day
          );
          return (
            <div key={day} className="p-4">
              <CardComponent key={day}>
                <div className={`grid grid-cols-1 gap-4`}>
                  <div className="grid grid-cols-2 items-center">
                    <p>{day}</p>
                    <div className="justify-self-end">
                      <GeneralButton
                        buttonText="+"
                        onClick={() => {
                          dispatch({
                            type: ADD_OR_REMOVE_FIXED_BKS,
                            payload: {
                              day,
                              booking: {
                                id: Math.floor(100000 + Math.random() * 900000),
                                start: '',
                                end: '',
                                email: '',
                              },
                              type: ADD,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  {matchedDay.length > 0 &&
                    matchedDay[0].bookings.map((bks) => {
                      return (
                        <div key={bks.id}>
                          <BookDetails
                            dispatch={dispatch}
                            bks={bks}
                            day={matchedDay[0].day}
                          />
                        </div>
                      );
                    })}
                </div>
              </CardComponent>
            </div>
          );
        })}
      </div>

      <div className="flex w-full justify-center">
        <GeneralButton
          buttonText="Modifica disponibilita"
          //  onClick={() => {
          //    const asyncFn = async () => {
          //      const handleSuccess = (response: any) => {};
          //      try {
          //        await manageAvailabilities(
          //          handleSuccess,
          //          state.schedules.weekAvalSettings
          //        );
          //        toast.success("Disponibilita' cambiate!", {
          //          position: toast.POSITION.TOP_CENTER,
          //        });
          //      } catch (e: any) {
          //        handleToastInFailRequest(e, toast);
          //      }
          //    };
          //    asyncFn();
          //  }}
        />
      </div>
    </div>
  );
};

export default FixedBksManager;
