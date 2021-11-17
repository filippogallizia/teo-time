import { BookingComponentType } from '../../../booking/BookingPageTypes';
import { BOLD, ITALIC } from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';
import DatePicker from 'react-datepicker';
import { handleToastInFailRequest } from '../../../../shared/locales/utils';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ADD,
  ADD_OR_REMOVE_HOLIDAY,
  DELETE,
  FORCE_RENDER,
  NO_VALUES,
  UPLOAD_ALL,
  UPLOAD_END_DATE,
  UPLOAD_HOLIDAY,
  UPLOAD_START_DATE,
} from '../../../booking/stateReducer';
import { DateTime } from 'luxon';
import { createBooking } from '../../../../services/calendar.service';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {
  GetHolidayResponseType,
  getHolidays,
} from '../../service/AdminPageService';
import _ from 'lodash';

const HolidaysManager = ({ dispatch, state }: BookingComponentType) => {
  const filterPassedTime = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    const asyncFn = async () => {
      const handleSuccess = (response: GetHolidayResponseType) => {
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
          const holidayInLocalState = _.find(state.schedules.holidays, [
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
      await getHolidays(handleSuccess);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, state.schedules.forceRender]);

  console.log(state.schedules.holidays, 'state');

  return (
    <div className=" grid grid-cols-1 gap-y-6 overflow-auto px-4">
      <div className="flex justify-between items-center p-2">
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

      {state.schedules.holidays.map((holiday: any, i: number) => {
        const pickerValue = state.schedules.holidays.filter(
          (hol) => hol.localId === holiday.localId
        );
        return (
          <div
            key={holiday.localId}
            className="grid grid-cols-1 gap-y-4 p-2 shadow-md"
          >
            <div className="grid grid-cols-2 gap-y-4">
              <div className="col-span-2 flex justify-between items-center">
                <p className={`${ITALIC}`}>Vacanza {i + 1}</p>
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
                  <p className="col-span-1">Inizio</p>
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
                  <p className="self-start">Fine</p>

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

      {state.schedules.holidays.length > 0 && (
        <div className="flex w-full justify-center">
          <GeneralButton
            buttonText="Prenota vacanze"
            onClick={() => {
              const handleSuccess = (response: any) => {
                return response;
              };
              const promises: Promise<any>[] = [];
              state.schedules.holidays.forEach((holiday) => {
                if (!holiday.isFromServer) {
                  promises.push(
                    createBooking(handleSuccess, {
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
                    dispatch({
                      type: FORCE_RENDER,
                      payload: state.schedules.forceRender + 1,
                    });
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
