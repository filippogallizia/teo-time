import { BOLD, ITALIC } from '../../../../constants/constant';
import GeneralButton from '../../../../component/GeneralButton';
import DatePicker from 'react-datepicker';
import { handleToastInFailRequest } from '../../../../helpers/utils';
import 'react-datepicker/dist/react-datepicker.css';

import { DateTime } from 'luxon';
//import BookingPageApi from
import { toast } from 'react-toastify';
import { useEffect, useReducer } from 'react';
import AdminPageApi, { GetHolidayResponseType } from '../../AdminPageApi';
import _ from 'lodash';
import i18n from '../../../../i18n';
import reducer, {
  ADD_OR_REMOVE_HOLIDAY,
  NO_VALUES,
  UPLOAD_ALL,
  UPLOAD_END_DATE,
  UPLOAD_HOLIDAY,
  UPLOAD_START_DATE,
} from './reducer';
import BookingPageApi from '../../../booking/BookingPageApi';

const ADD = 'ADD';
const DELETE = 'DELETE';

const initialState = {
  holidays: [],
};

const HolidaysManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filterPassedTime = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    const asyncFn = async () => {
      const handleSuccess = (response: GetHolidayResponseType) => {
        // TO REVIEW THIS LOGIC
        if (response.length === 0) {
          dispatch({
            type: UPLOAD_HOLIDAY,
            payload: {
              start: '',
              end: '',
              localId: 0,
              type: NO_VALUES,
              isFromServer: true,
            },
          });
        }
        response.forEach((holiday: any) => {
          const holidayInLocalState = _.find(state.holidays, [
            'localId',
            holiday.localId,
          ]);

          if (!holidayInLocalState) {
            dispatch({
              type: ADD_OR_REMOVE_HOLIDAY,
              payload: {
                start: holiday.start,
                end: holiday.end,
                localId: holiday.localId,
                type: ADD,
                isFromServer: true,
              },
            });
          } else {
            dispatch({
              type: UPLOAD_HOLIDAY,
              payload: {
                start: holiday.start,
                end: holiday.end,
                localId: holiday.localId,
                type: UPLOAD_ALL,
                isFromServer: true,
              },
            });
          }
        });
      };
      const response = await AdminPageApi.getHolidays();
      handleSuccess(response);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 gap-y-6 overflow-auto px-4">
      <div className="flex justify-between items-center p-2 gap-8">
        <p className={`${BOLD}`}>Aggiungi una vacanza</p>
        <GeneralButton
          buttonText="+"
          onClick={() => {
            dispatch({
              type: ADD_OR_REMOVE_HOLIDAY,
              payload: {
                start: DateTime.fromJSDate(new Date()).toISO(),
                end: DateTime.fromJSDate(new Date()).toISO(),
                localId: Math.floor(100000 + Math.random() * 900000),
                type: ADD,
                isFromServer: false,
              },
            });
          }}
        />
      </div>

      {state.holidays.map((holiday: any, i: number) => {
        const pickerValue = state.holidays.filter(
          (hol) => hol.localId === holiday.localId
        );
        return (
          <div
            key={holiday.localId}
            className="grid grid-cols-1 gap-y-4 p-2 shadow-md"
          >
            <div className="grid grid-cols-2 gap-y-4">
              <div className="col-span-2 flex justify-between items-center">
                <p className={`${ITALIC}`}>
                  {i18n.t('adminPage.holidayManagerPage.addHolidayButton')}{' '}
                  {i + 1}
                </p>
                <GeneralButton
                  buttonText="-"
                  disabled={holiday.isFromServer}
                  onClick={() => {
                    dispatch({
                      type: ADD_OR_REMOVE_HOLIDAY,
                      payload: {
                        start: DateTime.fromJSDate(new Date()).toISO(),
                        end: DateTime.fromJSDate(new Date()).toISO(),
                        localId: holiday.localId,
                        type: DELETE,
                        isFromServer: false,
                      },
                    });
                  }}
                />
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div className="col-span-3 grid grid-cols-1">
                  <p className="col-span-1">
                    {i18n.t('adminPage.holidayManagerPage.start')}{' '}
                  </p>
                  <div className="col-span-1">
                    <DatePicker
                      // className="w-40"
                      selected={new Date(pickerValue[0].start)}
                      onChange={(date: Date) => {
                        dispatch({
                          type: UPLOAD_HOLIDAY,
                          payload: {
                            start: DateTime.fromJSDate(date).toISO(),
                            end: DateTime.fromJSDate(date).toISO(),
                            localId: holiday.localId,
                            isFromServer: holiday.isFromServer,
                            type: UPLOAD_START_DATE,
                          },
                        });
                      }}
                      showTimeSelect
                      filterTime={filterPassedTime}
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div className="col-span-3 grid grid-cols-1">
                  <p className="self-start">
                    {i18n.t('adminPage.holidayManagerPage.end')}{' '}
                  </p>

                  <DatePicker
                    selected={new Date(pickerValue[0].end)}
                    onChange={(date: Date) => {
                      dispatch({
                        type: UPLOAD_HOLIDAY,
                        payload: {
                          start: DateTime.fromJSDate(date).toISO(),
                          end: DateTime.fromJSDate(date).toISO(),
                          localId: holiday.localId,
                          isFromServer: holiday.isFromServer,
                          type: UPLOAD_END_DATE,
                        },
                      });
                    }}
                    showTimeSelect
                    filterTime={filterPassedTime}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {state.holidays.length > 0 && (
        <div className="flex w-full justify-center">
          <GeneralButton
            buttonText="Prenota vacanze"
            onClick={() => {
              const promises: Promise<any>[] = [];
              state.holidays.forEach((holiday) => {
                if (!holiday.isFromServer) {
                  promises.push(
                    BookingPageApi.createBooking({
                      start: holiday.start,
                      end: holiday.end,
                      isHoliday: true,
                      localId: holiday.localId,
                    })
                  );
                }
              });

              if (promises.length > 0) {
                Promise.all(promises)
                  .then(() => {
                    toast.success("Ole' vacanze prenotate! Vai a surfare zio");
                    //dispatch({
                    //  type: FORCE_RENDER,
                    //  payload: state.forceRender + 1,
                    //});
                  })
                  .catch((e) => {
                    handleToastInFailRequest(e, toast);
                  });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HolidaysManager;
