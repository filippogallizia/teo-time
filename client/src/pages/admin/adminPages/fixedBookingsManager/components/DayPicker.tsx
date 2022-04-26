const options = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type Props = {
  value: string;
  onChange: (p: any) => void;
  disabled?: boolean;
};

const DayPicker = ({ value, onChange, disabled }: Props) => {
  return (
    <div>
      <input
        list="something_else"
        disabled={disabled}
        id="ice-cream-choice"
        name="ice-cream-choice"
        aria-invalid={false}
        autoComplete="off"
        placeholder="day"
        type="text"
        className="w-36 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={onChange}
      />
      <datalist id="something_else">
        {options.map((hour: string) => {
          return <option value={hour} />;
        })}
      </datalist>
    </div>
  );
};

export default DayPicker;
