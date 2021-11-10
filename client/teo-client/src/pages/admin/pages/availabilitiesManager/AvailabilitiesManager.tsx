import { BookingComponentType } from '../../../booking/BookingPageTypes';
import { SET_WEEK_AVAL_SETTINGS } from '../../../booking/stateReducer';
import { BOLD, ITALIC } from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';
import { manageAvailabilities } from './service/availabilitiesManagerService';

const AvalManager = ({ dispatch, state }: BookingComponentType) => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className=" grid grid-cols-1 gap-6 overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {weekDays.map((day: string) => {
          const dayInfo = state.schedules.weekAvalSettings.filter(
            (d) => d.day === day
          );

          return (
            <div key={day} className="shadow-md p-4">
              <div className={`grid grid-cols-1 gap-4`}>
                <p className={`${BOLD}`}>{day}</p>
                <div className={`grid grid-cols-3 gap-4 `}>
                  <p className={`col-span-3 ${ITALIC}`}>Orario Lavoro:</p>
                  <div className="col-span-3 grid grid-cols-2">
                    <p>start</p>
                    <input
                      type="time"
                      id="workTimeRange.start"
                      className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      value={
                        dayInfo.length > 0
                          ? dayInfo[0].parameters?.workTimeRange.start
                          : ''
                      }
                      onChange={(e) => {
                        dispatch({
                          type: SET_WEEK_AVAL_SETTINGS,
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
                      className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      value={
                        dayInfo.length > 0
                          ? dayInfo[0].parameters?.workTimeRange.end
                          : ''
                      }
                      onChange={(e) => {
                        dispatch({
                          type: SET_WEEK_AVAL_SETTINGS,
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
                        className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        value={
                          dayInfo.length > 0
                            ? dayInfo[0].parameters?.breakTimeRange.start
                            : ''
                        }
                        onChange={(e) => {
                          dispatch({
                            type: SET_WEEK_AVAL_SETTINGS,
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
                        className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        value={
                          dayInfo.length > 0
                            ? dayInfo[0].parameters?.breakTimeRange.end
                            : ''
                        }
                        onChange={(e) => {
                          dispatch({
                            type: SET_WEEK_AVAL_SETTINGS,
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
      <div className="grid grid-cols-1 gap-4 p-2 shadow-md">
        <p className={`${BOLD}`}>Generali</p>
        <div className="grid grid-cols-2 gap-4">
          <p className={`col-span-2 ${ITALIC}`}>Pausa tra lezioni:</p>
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p className="self-start">ore</p>
              <input
                className="w-20 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                disabled
                id="breakTimeRange.start"
                value={
                  state.schedules.weekAvalSettings[0].parameters
                    ?.breakTimeBtwEvents.hours
                }
                // onChange={(e) => {
                //   dispatch({
                //     type: SET_WEEK_AVAL_SETTINGS,
                //     payload: { day: day, e: e },
                //   });
                // }}
              />
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p>minuti</p>
              <input
                type="number"
                className="w-20 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="breakTimeRange.end"
                required
                disabled
                value={
                  state.schedules.weekAvalSettings[0].parameters
                    ?.breakTimeBtwEvents.minutes
                }
                // onChange={(e) => {
                //   dispatch({
                //     type: SET_WEEK_AVAL_SETTINGS,
                //     payload: { day: day, e: e },
                //   });
                // }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <p className={`col-span-3 ${ITALIC}`}>Durata Lezione:</p>
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p className="self-start">ore</p>
              <input
                className="w-20 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                id="pausa-ore"
                disabled
                value={
                  state.schedules.weekAvalSettings[0].parameters?.eventDuration
                    .hours
                }
                // value={state.schedules.manageAvailabilities}
                // onChange={(e) => {
                //   dispatch({
                //     type: SET_WEEK_AVAL_SETTINGS,
                //     payload: { day: day, e: e },
                //   });
                // }}
              />
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p>minuti</p>
              <input
                type="number"
                className="w-20 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="breakTimeRange.end"
                required
                disabled
                value={
                  state.schedules.weekAvalSettings[0].parameters?.eventDuration
                    .minutes
                }
                // value={
                //   dayInfo.length > 0
                //     ? dayInfo[0].parameters?.breakTimeRange.end
                //     : ''
                // }
                // onChange={(e) => {
                //   dispatch({
                //     type: SET_WEEK_AVAL_SETTINGS,
                //     payload: { day: day, e: e },
                //   });
                // }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <GeneralButton
          buttonText="Modifica disponibilita"
          onClick={() => {
            const asyncFn = async () => {
              const handleSuccess = (response: any) => {};
              await manageAvailabilities(
                handleSuccess,
                state.schedules.weekAvalSettings
              );
            };
            asyncFn();
          }}
        />
      </div>
    </div>
  );
};

export default AvalManager;
