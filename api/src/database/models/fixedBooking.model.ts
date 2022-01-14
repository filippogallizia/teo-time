const FixedBooking = (sequelize: any, Sequelize: any) => {
  const fixedBooking = sequelize.define(
    'fixedBook',
    {
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      email: {
        type: Sequelize.STRING,
      },
      day: {
        type: Sequelize.STRING,
      },
      localId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return fixedBooking;
};

export default FixedBooking;
