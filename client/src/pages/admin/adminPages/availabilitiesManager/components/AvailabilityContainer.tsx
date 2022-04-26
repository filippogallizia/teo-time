import GeneralButton from '../../../../../component/GeneralButton';
import { BOLD, ITALIC } from '../../../../../constants/constant';
import i18n from '../../../../../i18n';
import {
  Actions,
  DayAvalSettingsType,
  EDIT_SELECTED_DAY,
  InitialState,
  MODAL,
  SET_SELECTED_DAY,
} from '../reducer';
import InputsPair from './InputsPair';

type Props = {
  state: InitialState;
  dispatch: React.Dispatch<Actions>;
  day: DayAvalSettingsType;
  disabled?: boolean;
};

const AvailabilityDetails = ({ state, dispatch, day, disabled }: Props) => {
  return (
    <>
      <div>
        <div className={`grid grid-cols-1 gap-4`}>
          <div className="flex justify-between focus-within:items-center">
            <p className={`${BOLD}`}>{day.day}</p>
            {!state.modal.isOpen && (
              <GeneralButton
                buttonText="edit"
                onClick={() => {
                  dispatch({
                    type: SET_SELECTED_DAY,
                    payload: day,
                  });
                  dispatch({
                    type: MODAL,
                    payload: {
                      modal: {
                        isOpen: true,
                      },
                    },
                  });
                }}
              />
            )}
          </div>
          <div className={`grid grid-cols-3 gap-4`}>
            <p className={`col-span-3 ${ITALIC}`}>
              {i18n.t('adminPage.avalManagerPage.workingTime')}
            </p>
            <InputsPair
              dispatch={dispatch}
              day={day}
              disabled={disabled}
              firstInputName="workTimeStart"
              secondInputName="workTimeEnd"
            />
          </div>
          <div className={`grid grid-cols-3 gap-4`}>
            <p className={`col-span-3 ${ITALIC}`}>
              {i18n.t('adminPage.avalManagerPage.break')}
            </p>
            <InputsPair
              dispatch={dispatch}
              day={day}
              disabled={disabled}
              firstInputName="breakTimeStart"
              secondInputName="breakTimeEnd"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p className={`col-span-2 ${ITALIC}`}>
              Pausa tra lezioni - ore e minuti:
            </p>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2 items-center">
                <input
                  placeholder="ore"
                  className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="breakTimeBtwEventsHours"
                  disabled={disabled}
                  value={day['breakTimeBtwEventsHours']}
                  onChange={(e) => {
                    dispatch({
                      type: EDIT_SELECTED_DAY,
                      payload: e,
                    });
                  }}
                />
                <input
                  placeholder="minuti"
                  className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="breakTimeBtwEventsMinutes"
                  disabled={disabled}
                  value={day['breakTimeBtwEventsMinutes']}
                  onChange={(e) => {
                    dispatch({
                      type: EDIT_SELECTED_DAY,
                      payload: e,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <p className={`col-span-3 ${ITALIC}`}>Durata Lezione:</p>
            <InputsPair
              dispatch={dispatch}
              day={day}
              disabled={disabled}
              firstInputName="eventDurationHours"
              secondInputName="eventDurationMinutes"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailabilityDetails;
