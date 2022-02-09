const options = [
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
};

const HourPicker = ({ value, onChange }: Props) => {
  console.log(value, 'inputvalue');

  return (
    <div>
      <label htmlFor="ice-cream-choice">Inizio</label>
      <input
        list="ice-cream-flavors"
        id="ice-cream-choice"
        name="ice-cream-choice"
        aria-invalid={false}
        autoComplete="off"
        type="text"
        //className="border-2 border-indigo-600"
        className="w-32 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id="ice-cream-flavors">
        {options.map((hour: string) => {
          return <option value={hour} />;
        })}
      </datalist>
    </div>
  );
};

export default HourPicker;
