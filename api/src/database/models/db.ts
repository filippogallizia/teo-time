import { DataTypes, Dialect, OperatorsAliases, Sequelize } from 'sequelize';

import dbConfig from '../../config/db.config';
import BookingsModel from './booking.model';
import DatabaseAvailabiltyModel from './databaseAvailabilty.model';
import FixedBookingsModel from './fixedBooking.model';
import UserModel from './user.model';

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as Dialect,
    operatorsAliases: 0 as unknown as OperatorsAliases,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};
//@ts-expect-error
db.Sequelize = Sequelize;
//@ts-expect-error
db.sequelize = sequelize;
//@ts-expect-error
db.user = UserModel(sequelize, DataTypes);
//@ts-expect-error
db.Bookings = BookingsModel(sequelize, Sequelize);
//@ts-expect-error
db.FixedBookings = FixedBookingsModel(sequelize, Sequelize);
//@ts-expect-error
db.DatabaseAvailabilty = DatabaseAvailabiltyModel(sequelize, Sequelize);
//@ts-expect-error
db.user.hasMany(db.Bookings, { as: 'bookings' });
//@ts-expect-error
db.Bookings.belongsTo(db.user, {
  as: 'user',
});

export default db as any;
