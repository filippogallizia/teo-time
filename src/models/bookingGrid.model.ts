const bookingGrid = (sequelize: any, Sequelize: any) => {
  const Bookings = sequelize.define('bookings', {
    start: {
      type: Sequelize.DATE,
    },
    end: {
      type: Sequelize.DATE,
    },
  });

  return Bookings;
};

export default bookingGrid;
