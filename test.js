const state = [
  {
    id: 1,
    start: '2021-10-04T08:30:00.000Z',
    end: '2021-10-04T21:15:00.000Z',
    email: 'filo',
    day: 'Monday',
    localId: 1,
  },
  {
    id: 2,
    start: '2021-10-04T15:00:00.000Z',
    end: '2021-10-04T16:30:00.000Z',
    email: 'gio',
    day: 'Monday',
    localId: 2,
  },
  {
    id: 23,
    start: '2021-10-04T09:30:00.000Z',
    end: '2021-10-04T21:15:00.000Z',
    email: 'filo',
    day: 'Monday',
    localId: 9,
  },
  {
    id: 24,
    start: '2021-10-04T12:00:00.000Z',
    end: '2021-10-04T16:30:00.000Z',
    email: 'gio',
    day: 'Monday',
    localId: 6,
  },
  {
    id: 35,
    start: '2021-10-04T09:30:00.000Z',
    end: '2021-10-04T21:15:00.000Z',
    email: 'filo',
    day: 'Monday',
    localId: 19,
  },
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const result = weekDays.map((weekDay) => {
  return {
    day: weekDay,
    bookings: state
      .filter((day) => day.day === weekDay)
      .map((d) => {
        return {
          start: d.start,
          end: d.end,
          id: d.localId,
          email: d.email,
        };
      }),
  };
});

console.log(result, 'result');
