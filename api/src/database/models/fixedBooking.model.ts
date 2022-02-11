const FixedBooking = (sequelize: any, Sequelize: any) => {
  const fixedBooking = sequelize.define(
    'fixedBooking',
    {
      start: {
        type: Sequelize.STRING,
      },
      end: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      day: {
        type: Sequelize.STRING,
      },
      exceptionDate: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return fixedBooking;
};

export default FixedBooking;
