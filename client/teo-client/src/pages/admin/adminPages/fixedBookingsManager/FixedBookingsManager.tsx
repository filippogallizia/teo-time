import { ADD, DELETE, FixedBookType } from '../../../booking/stateReducer';
import { ITALIC } from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';

import CardComponent from '../../components/Card';
import i18n from '../../../../i18n';
import { useEffect, useReducer } from 'react';
import { promptConfirmation } from '../../../../shared/locales/utils';
import { getFixedBookings } from './fixedBookingsManagerService';
import reducer, {
  ADD_OR_REMOVE_FIXED_BKS,
  SET_FIXED_BKS,
  UPLOAD_EMAIL_CLIENT,
  UPLOAD_END_DATE,
  UPLOAD_START_DATE,
} from './reducer';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type BookDetailsType = {
  bks: FixedBookType;
  day: string;
};

const initialState = {
  fixedBks: [],
};

const BookDetails = ({ bks, day }: BookDetailsType) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className={`grid grid-cols-3 gap-4 border-b-4 pb-2`}>
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
      <div className="col-span-3 red-200">
        <button
          className="text-red-600"
          onClick={() => {
            const isConfirmed = promptConfirmation();
            if (!isConfirmed) return;
            else {
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
            }
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const FixedBksManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
          const matchedDay = state.fixedBks.filter((d) => d.day === day);
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
                          <BookDetails bks={bks} day={matchedDay[0].day} />
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
