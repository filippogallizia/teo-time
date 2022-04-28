import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface BookingModel
  extends Model<
    InferAttributes<BookingModel>,
    InferCreationAttributes<BookingModel>
  > {
  id?: number;
  start: string;
  end: string;
  isHoliday: boolean;
  calendarEventId?: string;
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
      calendarEventId: {
        type: Sequelize.STRING,
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
