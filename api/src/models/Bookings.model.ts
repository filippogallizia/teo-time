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
    },
    {
      timestamps: false,
    }
  );

  return bookings;
};

export default Bookings;