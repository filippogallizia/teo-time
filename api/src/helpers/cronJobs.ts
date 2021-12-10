import cron from 'node-cron';
import { Op } from 'sequelize';
const db = require('../models/db');

export const deleteOldBookings = async () => {
  const Bookings = db.Bookings;

  const currentTime = new Date();
  try {
    await Bookings.destroy({
      where: {
        end: { [Op.lt]: currentTime.toISOString() },
      },
    });
    console.log('this is the cronJob, past bks have been deleted');
  } catch (e) {
    console.log('this is the cronJob, something went wrong');
  }
};

export const runEveryMinute = () => {
  cron.schedule('0 0 0 * * *', function () {
    deleteOldBookings();
  });
};
//export default runEveryMinute;
