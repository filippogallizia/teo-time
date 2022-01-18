const Availability = (sequelize: any, Sequelize: any) => {
  const availabilities = sequelize.define(
    'availabilities',
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

  return availabilities;
};

export default Availability;
