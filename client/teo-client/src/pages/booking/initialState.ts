const today = new Date();
today.setHours(0, 0, 0, 0);

const startingAval = new Date();
startingAval.setHours(7, 0, 0, 0);

const endAval = new Date();
endAval.setHours(20, 30, 0, 0);

export const initialState = {
  schedules: {
    selectedDate: today.toISOString(),
    selectedHour: '00:00',
    availabilities: [
      {
        start: startingAval.toISOString(),
        end: endAval.toISOString(),
      },
    ],
    userBookings: [],
    isConfirmPhase: false,
    isRenderAval: false,
    currentUser: {},
    bookingsAndUsers: [],
    weekAvalSettings: [
      {
        day: 'Monday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Tuesday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Wednesday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Thursday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
      {
        day: 'Friday',
        parameters: {
          workTimeRange: {
            start: '07:30',
            end: '21:00',
          },
          breakTimeRange: {
            start: '12:00',
            end: '13:30',
          },
          eventDuration: { hours: 1, minutes: 0 },
          breakTimeBtwEvents: { hours: 0, minutes: 30 },
        },
      },
    ],
    fixedBks: [
      {
        day: 'Monday',
        bookings: [],
      },
      {
        day: 'Tuesday',
        bookings: [],
      },
      {
        day: 'Wednesday',
        bookings: [],
      },
      {
        day: 'Thursday',
        bookings: [],
      },
      {
        day: 'Friday',
        bookings: [],
      },
    ],
    forceRender: 0,
    holidays: [],
    location: '',
  },
};
