// {
//   day: 'Monday',
//   parameters: {
//     workTimeRange: {
//       start: '2021-10-04T07:30:00.000Z',
//       end: '2021-10-04T21:15:00.000Z',
//     },
//     breakTimeRange: {
//       start: '2021-10-04T12:00:00.000Z',
//       end: '2021-10-04T13:30:00.000Z',
//     },
//     eventDuration: { hours: 1, minutes: 0 },
//     breakTimeBtwEvents: { hours: 0, minutes: 30 },
//   },
// },

const WorkSettings = (sequelize: any, Sequelize: any) => {
  const WorkSettings = sequelize.define(
    'workSetting',
    {
      day: {
        type: Sequelize.STRING,
        unique: true,
      },
      workTimeStart: {
        type: Sequelize.STRING,
      },
      workTimeEnd: {
        type: Sequelize.STRING,
      },
      breakTimeStart: {
        type: Sequelize.STRING,
      },
      breakTimeEnd: {
        type: Sequelize.STRING,
      },
      eventDurationHours: {
        type: Sequelize.STRING,
      },
      eventDurationMinutes: {
        type: Sequelize.STRING,
      },
      breakTimeBtwEventsHours: {
        type: Sequelize.STRING,
      },
      breakTimeBtwEventsMinutes: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return WorkSettings;
};

export default WorkSettings;
