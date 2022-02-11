const defaultOptions = [
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

type Props = {
  value: string;
  onChange: (p: any) => void;
  type: any;
  disabled?: boolean;
  id?: any;
  options?: string[];
};

const HourPicker = ({
  value,
  onChange,
  type,
  id,
  disabled,
  options,
}: Props) => {
  const OPTIONS = options ?? defaultOptions;

  return (
    <div>
      <input
        disabled={disabled}
        id={id ?? `${type}type`}
        list={type}
        name="ice-cream-choice"
        aria-invalid={false}
        autoComplete="off"
        type="text"
        placeholder={type}
        className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={onChange}
      />
      <datalist id={type}>
        {OPTIONS.map((hour: string) => {
          return <option value={hour} />;
        })}
      </datalist>
    </div>
  );
};

export default HourPicker;
