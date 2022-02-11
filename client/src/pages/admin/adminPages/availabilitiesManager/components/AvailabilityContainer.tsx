import GeneralButton from '../../../../../component/GeneralButton';
import { BOLD, ITALIC } from '../../../../../constants/constant';
import i18n from '../../../../../i18n';
import HourPicker from '../../fixedBookingsManager/components/HourPicker';
import {
  Actions,
  DayAvalSettingsType,
  EDIT_SELECTED_DAY,
  InitialState,
  MODAL,
  SET_SELECTED_DAY,
} from '../reducer';

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
            <div className="col-span-3 grid grid-cols-2 items-center">
              <p>{i18n.t('adminPage.avalManagerPage.start')}</p>
              <HourPicker
                disabled={disabled}
                type={`workTimeStart${day.day}`}
                id="workTimeStart"
                value={day.workTimeStart}
                onChange={(e) => {
                  dispatch({
                    type: EDIT_SELECTED_DAY,
                    payload: e,
                  });
                }}
              />
            </div>
            <div className="col-span-3 grid grid-cols-2 items-center">
              <p>{i18n.t('adminPage.avalManagerPage.end')}</p>
              <HourPicker
                disabled={disabled}
                type={`workTimeEnd${day.day}`}
                id="workTimeEnd"
                value={day.workTimeEnd}
                onChange={(e) => {
                  dispatch({
                    type: EDIT_SELECTED_DAY,
                    payload: e,
                  });
                }}
              />
            </div>
          </div>
          <div className={`grid grid-cols-3 gap-4`}>
            <p className={`col-span-3 ${ITALIC}`}>
              {i18n.t('adminPage.avalManagerPage.break')}
            </p>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2 items-center">
                <p>{i18n.t('adminPage.avalManagerPage.start')}</p>
                <HourPicker
                  disabled={disabled}
                  type={`break_start${day.day}`}
                  id="breakTimeStart"
                  value={day.breakTimeStart}
                  onChange={(e) => {
                    dispatch({
                      type: EDIT_SELECTED_DAY,
                      payload: e,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2 items-center">
                <p>{i18n.t('adminPage.avalManagerPage.end')}</p>
                <HourPicker
                  disabled={disabled}
                  type={`breakTimeEnd${day.day}`}
                  id="breakTimeEnd"
                  value={day.breakTimeEnd}
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
          <div className="grid grid-cols-2 gap-4">
            <p className={`col-span-2 ${ITALIC}`}>Pausa tra lezioni:</p>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2">
                <p className="self-start">ore</p>
                <HourPicker
                  disabled={disabled}
                  type={`breakTimeBtwEventsHours${day.day}`}
                  id="breakTimeBtwEventsHours"
                  value={day.breakTimeBtwEventsHours}
                  onChange={(e) => {
                    dispatch({
                      type: EDIT_SELECTED_DAY,
                      payload: e,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2">
                <p>minuti</p>
                <HourPicker
                  disabled={disabled}
                  type={`breakTimeBtwEventsMinutes${day.day}`}
                  id="breakTimeBtwEventsMinutes"
                  value={day.breakTimeBtwEventsMinutes}
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
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2">
                <p className="self-start">ore</p>
                <HourPicker
                  disabled={disabled}
                  type={`eventDurationHours${day.day}`}
                  id="eventDurationHours"
                  value={day.eventDurationHours}
                  onChange={(e) => {
                    dispatch({
                      type: EDIT_SELECTED_DAY,
                      payload: e,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-2">
              <div className="col-span-3 grid grid-cols-2">
                <p>minuti</p>
                <HourPicker
                  disabled={disabled}
                  type={`eventDurationMinutes${day.day}`}
                  id="eventDurationMinutes"
                  value={day.eventDurationMinutes}
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
        </div>
      </div>
    </>
  );
};

export default AvailabilityDetails;
