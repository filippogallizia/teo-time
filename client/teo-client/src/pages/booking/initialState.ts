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
    isConfirmPhase: false,
    isRenderAval: false,
    currentUser: {},
    location: '',
  },
};
