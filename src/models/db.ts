const dbConfig = require('../config/db.config.js');
import BookingGrid from '';

const Sequelize = require('sequelize');
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
db.user = require('./user.model.ts')(sequelize, Sequelize);
//@ts-expect-error
db.bookingGrid = BookingGrid(sequelize, Sequelize);

module.exports = db;
