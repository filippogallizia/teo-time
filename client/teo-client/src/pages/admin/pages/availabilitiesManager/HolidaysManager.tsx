import { BookingComponentType } from '../../../booking/BookingPageTypes';
import { BOLD, ITALIC } from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';
import DatePicker from 'react-datepicker';
import { handleToastInFailRequest } from '../../../../shared/locales/utils';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingType, TimeRangeType } from '../../../../../types/Types';
import {
  ADD_HOLIDAYS,
  FORCE_RENDER,
  Holiday,
  SET_HOLIDAY,
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
        response.forEach((holiday: BookingType) => {
          const holidayInLocalState = _.find(state.schedules.holidays, [
            'start',
            holiday.start,
          ]);
          console.log('here');
          if (!holidayInLocalState) {
            dispatch({
              type: ADD_HOLIDAYS,
              payload: {
                start: holiday.start,
                end: holiday.end,
                id: holiday.id,
                type: 'add',
                isFromServer: true,
              },
            });
          }
        });
      };
      await getHolidays(handleSuccess);
    };
    asyncFn();
  }, [dispatch]);

  console.log(state.schedules.holidays, 'state local');

  return (
    <div className=" grid grid-cols-1 gap-y-6 overflow-auto px-4">
      <div className="flex justify-between items-center p-2">
        <p className={`${BOLD}`}>Vacanze</p>
        <GeneralButton
          buttonText="+"
          onClick={() => {
            dispatch({
              type: ADD_HOLIDAYS,
              payload: {
                start: DateTime.fromJSDate(new Date()).toISO(),
                end: DateTime.fromJSDate(new Date()).toISO(),
                id: Math.random(),
                type: 'add',
                isFromServer: false,
              },
            });
          }}
        />
      </div>

      {state.schedules.holidays.map((holiday: Holiday) => {
        const pickerValue = state.schedules.holidays.filter(
          (hol) => hol.id === holiday.id
        );
        return (
          <div
            key={holiday.id}
            className="grid grid-cols-1 gap-y-4 p-2 shadow-md"
          >
            <div className="grid grid-cols-2 gap-y-4">
              <div className="col-span-2 flex justify-between items-center">
                <p className={`${ITALIC}`}>Pausa tra lezioni:</p>
                <GeneralButton
                  buttonText="-"
                  onClick={() => {
                    console.log(holiday, 'holiday');
                    if (holiday.isFromServer) {
                      console.log('is from server');
                    }
                    dispatch({
                      type: ADD_HOLIDAYS,
                      payload: {
                        start: DateTime.fromJSDate(new Date()).toISO(),
                        end: DateTime.fromJSDate(new Date()).toISO(),
                        id: holiday.id,
                        type: 'delete',
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
                          type: SET_HOLIDAY,
                          payload: {
                            start: DateTime.fromJSDate(date).toISO(),
                            end: DateTime.fromJSDate(date).toISO(),
                            id: holiday.id,
                            type: 'start',
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
                        type: SET_HOLIDAY,
                        payload: {
                          start: DateTime.fromJSDate(date).toISO(),
                          end: DateTime.fromJSDate(date).toISO(),
                          id: holiday.id,
                          type: 'end',
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
            buttonText="Modifica disponibilita"
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
                    })
                  );
                }
              });

              Promise.all(promises)
                .then(() => {
                  toast.success("Ole' vacanze prenotate! Vai a surfare zio");
                  console.log('filo');
                  // dispatch({
                  //   type: FORCE_RENDER,
                  //   payload: state.schedules.forceRender + 1,
                  // });
                })
                .catch((e) => {
                  handleToastInFailRequest(e, toast);
                });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HolidaysManager;
