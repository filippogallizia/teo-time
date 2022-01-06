const FixedBookings = (sequelize: any, Sequelize: any) => {
  const fixedBookings = sequelize.define(
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

  return fixedBookings;
};

export default FixedBookings;
