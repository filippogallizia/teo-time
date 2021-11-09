import { BookingComponentType } from '../../../booking/BookingPageTypes';
import { SET_WEEK_AVAL_SETTINGS } from '../../../booking/stateReducer';
import { BOLD, ITALIC } from '../../../../shared/locales/constant';
import GeneralButton from '../../../../component/GeneralButton';
import { manageAvailabilities } from './service/availabilitiesManagerService';

const AvailabilitiesManager = ({ dispatch, state }: BookingComponentType) => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className=" grid grid-cols-1 gap-6 overflow-auto px-4">
      <div className="grid grid-cols-1 gap-4">
        {weekDays.map((day: string) => {
          const dayInfo = state.schedules.weekAvalSettings.filter(
            (d) => d.day === day
          );

          return (
            <div key={day} className="shadow-md">
              <div className={`grid grid-cols-1 gap-4`}>
                <p className={`${BOLD}`}>{day}</p>
                <div className={`grid grid-cols-3 gap-4 `}>
                  <p className={`col-span-3 ${ITALIC}`}>Orario Lavoro:</p>
                  <div className="col-span-3 grid grid-cols-2">
                    <p>start</p>
                    <input
                      type="time"
                      id="workTimeRange.start"
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
        <div className="grid grid-cols-3 gap-4 justify-items-start ">
          <p className={`col-span-3 ${ITALIC}`}>Pausa tra lezioni:</p>
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p className="self-start">ore</p>
              <input
                className=" border border-solid border-black-dark"
                type="number"
                id="pausa-ore"
                // value={
                //   dayInfo.length > 0
                //     ? dayInfo[0].parameters?.breakTimeRange.start
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
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p>minuti</p>
              <input
                type="number"
                className=" border border-solid border-black-dark"
                id="breakTimeRange.end"
                required
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
        <div className="grid grid-cols-3 gap-4 justify-items-start ">
          <p className={`col-span-3 ${ITALIC}`}>Durata Lezione:</p>
          <div className="col-span-3 grid grid-cols-2">
            <div className="col-span-3 grid grid-cols-2">
              <p className="self-start">ore</p>
              <input
                className=" border border-solid border-black-dark"
                type="number"
                id="pausa-ore"
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
                className=" border border-solid border-black-dark"
                id="breakTimeRange.end"
                required
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

export default AvailabilitiesManager;
