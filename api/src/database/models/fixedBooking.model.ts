export type FixedBookingModelType = {
  day: string;
  email: string;
  end: string;
  id: number;
  localId: number;
  start: string;
};

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
    },
    {
      timestamps: false,
    }
  );

  return fixedBooking;
};

export default FixedBooking;
