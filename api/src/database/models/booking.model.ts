import { Model } from 'sequelize';

export interface BookingModel extends Model {
  id?: number;
  start: string;
  end: string;
  isHoliday: boolean;
  localId: number;
}

const Booking = (sequelize: any, Sequelize: any) => {
  const booking = sequelize.define(
    'booking',
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

  return booking;
};

export default Booking;
