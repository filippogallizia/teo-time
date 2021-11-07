import { BookingComponentType } from '../../../booking/BookingPageTypes';
import { SET_MANAGE_AVAILABILITIES } from '../../../booking/bookingReducer';
import {
  BOLD,
  ITALIC,
  MARGIN_BOTTOM,
  MEDIUM_MARGIN_BOTTOM,
} from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';
import { manageAvailabilities } from './service/availabilitiesManagerService';

const AvailabilitiesManager = ({ dispatch, state }: BookingComponentType) => {
  //   {
  //     day: 'Monday',
  //   parameters: {
  //       workTimeRange: {
  //         start: '2021-10-04T07:30:00.000Z',
  //         end: '2021-10-04T21:15:00.000Z',
  //       },
  //       breakTimeRange: {
  //         start: '2021-10-04T12:00:00.000Z',
  //         end: '2021-10-04T13:30:00.000Z',
  //       },
  //       eventDuration: { hours: 1, minutes: 0 },
  //       breakTimeBtwEvents: { hours: 0, minutes: 30 },
  //     },
  //   },

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {weekDays.map((day: string) => {
          const dayInfo = state.schedules.manageAvailabilities.filter(
            (d) => d.day === day
          );

          return (
            <div key={day}>
              <div className={`grid grid-cols-1 gap-4`}>
                <p className={`${BOLD}`}>{day}</p>
                <div className={`grid grid-cols-3 gap-4 `}>
                  <p className={`col-span-3 ${ITALIC}`}>Orario Lavoro:</p>
                  <div className="col-span-3 grid grid-cols-2">
                    <p>start</p>
                    <input
                      //   className="border-2 border-gray-2"
                      type="time"
                      id="workTimeRange.start"
                      //   name="appt"
                      min="00:00"
                      max="12:00"
                      required
                      value={
                        dayInfo.length > 0
                          ? dayInfo[0].parameters?.workTimeRange.start
                          : ''
                      }
                      //   value={19}
                      onChange={(e) => {
                        dispatch({
                          type: SET_MANAGE_AVAILABILITIES,
                          payload: { day: day, e: e },
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-3 grid grid-cols-2">
                    <p>end</p>
                    <input
                      type="time"
                      id="workTimeRange.end"
                      //   name="appt"
                      min="13:00"
                      max="24:00"
                      required
                      value={
                        dayInfo.length > 0
                          ? dayInfo[0].parameters?.workTimeRange.end
                          : ''
                      }
                      onChange={(e) => {
                        dispatch({
                          type: SET_MANAGE_AVAILABILITIES,
                          payload: { day: day, e: e },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className={`grid grid-cols-3 gap-4`}>
                  <p className={`col-span-3 ${ITALIC}`}>Pausa:</p>
                  <div className="col-span-3 grid grid-cols-2">
                    <div className="col-span-3 grid grid-cols-2">
                      <p className="self-start">start</p>
                      <input
                        type="time"
                        id="breakTimeRange.start"
                        //   name="appt"
                        min="00:00"
                        max="12:00"
                        required
                        value={
                          dayInfo.length > 0
                            ? dayInfo[0].parameters?.breakTimeRange.start
                            : ''
                        }
                        onChange={(e) => {
                          dispatch({
                            type: SET_MANAGE_AVAILABILITIES,
                            payload: { day: day, e: e },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-3 grid grid-cols-2">
                    <div className="col-span-3 grid grid-cols-2">
                      <p>end</p>
                      <input
                        type="time"
                        id="breakTimeRange.end"
                        //   name="appt"
                        min="13:00"
                        max="24:00"
                        required
                        value={
                          dayInfo.length > 0
                            ? dayInfo[0].parameters?.breakTimeRange.end
                            : ''
                        }
                        onChange={(e) => {
                          dispatch({
                            type: SET_MANAGE_AVAILABILITIES,
                            payload: { day: day, e: e },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-4 py-10">
        <div className="grid grid-cols-3 gap-4 justify-items-start ">
          <p className="col-span-2">Pausa tra lezioni:</p>
          <div className="col-span-1">
            <input
              type="time"
              id="eventDuration.hours"
              //   name="appt"
              min="00:00"
              max="03:00"
              required
              //   onChange={(e) => {
              //     dispatch({
              //       type: SET_MANAGE_AVAILABILITIES,
              //       payload: { day: 'onday', e: e },
              //     });
              //   }}
              //   value={value}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 justify-items-start">
          <p className="col-span-2">Durata training:</p>
          <div className="col-span-1">
            {/* <Select id="breakTimeBtwEvents.hours" options={options} /> */}

            <input
              type="time"
              id="breakTimeBtwEvents.hours"
              //   id="appt"
              //   name="appt"
              min="00:00"
              max="03:00"
              required
              //   onChange={(e) => onChange(e.target.value)}
              //   value={value}
            />
          </div>
        </div>
      </div>
      <GeneralButton
        buttonText="Modifica disponibilita"
        onClick={() => {
          const asyncFn = async () => {
            const handleSuccess = (response: any) => {
              console.log(response);
            };

            await manageAvailabilities(
              handleSuccess,
              state.schedules.manageAvailabilities
            );
          };
          asyncFn();
        }}
      />
    </div>
  );
};

export default AvailabilitiesManager;
