const dbConfig = require('../../config/db.config.js');

import BookingsModel from './Bookings.model';
import FixedBookingsModel from './fixedBookings.model';
import WorkSettingsModel from './weekAvailabilitiesSetting.model';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,

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
db.user = require('./user.model.ts')(sequelize, DataTypes);
//@ts-expect-error
db.Bookings = BookingsModel(sequelize, Sequelize);
//@ts-expect-error
db.FixedBookings = FixedBookingsModel(sequelize, Sequelize);
//@ts-expect-error
db.WeekavalSettings = WorkSettingsModel(sequelize, Sequelize);
//@ts-expect-error
db.user.hasMany(db.Bookings, { as: 'bookings' });
//@ts-expect-error
db.Bookings.belongsTo(db.user, {
  as: 'user',
});

module.exports = db;
