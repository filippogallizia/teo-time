import HourPicker from '../../fixedBookingsManager/components/HourPicker';
import { Actions, DayAvalSettingsType, EDIT_SELECTED_DAY } from '../reducer';

type Props = {
  dispatch: React.Dispatch<Actions>;
  day: DayAvalSettingsType;
  disabled?: boolean;
  firstInputName: string;
  secondInputName: string;
};

const InputsPair = ({
  dispatch,
  day,
  disabled,
  firstInputName,
  secondInputName,
}: Props) => {
  return (
    <div className="col-span-3 grid grid-cols-2">
      <div className="col-span-3 grid grid-cols-2 items-center">
        <HourPicker
          disabled={disabled}
          type={`${firstInputName}${day.day}`}
          id={firstInputName}
          //@ts-expect-error
          value={day[firstInputName]}
          onChange={(e) => {
            dispatch({
              type: EDIT_SELECTED_DAY,
              payload: e,
            });
          }}
        />
        <HourPicker
          disabled={disabled}
          type={`${secondInputName}${day.day}`}
          id={secondInputName}
          //@ts-expect-error
          value={day[secondInputName]}
          onChange={(e) => {
            dispatch({
              type: EDIT_SELECTED_DAY,
              payload: e,
            });
          }}
        />
      </div>
    </div>
  );
};

export default InputsPair;
