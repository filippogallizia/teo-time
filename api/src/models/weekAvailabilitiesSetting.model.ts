const WeekAvailabilitiesSettings = (sequelize: any, Sequelize: any) => {
  const WeekAvailabilitiesSettings = sequelize.define(
    'weekAvailabilitiesSetting',
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

  return WeekAvailabilitiesSettings;
};

export default WeekAvailabilitiesSettings;
