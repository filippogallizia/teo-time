const WeekavalSettings = (sequelize: any, Sequelize: any) => {
  const WeekavalSettings = sequelize.define(
    'weekavalSetting',
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

  return WeekavalSettings;
};

export default WeekavalSettings;
