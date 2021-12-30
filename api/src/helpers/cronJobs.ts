import cron from 'node-cron';
import { Op } from 'sequelize';

export const deleteOldBookings = async (db: any) => {
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

export const runEveryDay = (db: any) => {
  cron.schedule('0 0 1 * * *', function () {
    deleteOldBookings(db);
  });
};
