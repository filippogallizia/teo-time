const Bookings = (sequelize: any, Sequelize: any) => {
  const bookings = sequelize.define(
    'bookings',
    {
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      isHoliday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      localId: {
        type: Sequelize.INTEGER,
        defaultValue: undefined,
      },
    },
    {
      timestamps: false,
    }
  );

  return bookings;
};

export default Bookings;
