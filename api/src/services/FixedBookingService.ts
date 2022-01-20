import { BookingModel } from '../database/models/booking.model';
import { FixedBookingModelType } from '../database/models/fixedBooking.model';
import { QueryDates } from './BookingService/BookingService';

const db = require('../database/models/db');

class FixedBookingService {
  fixedBookingModel = db.FixedBookings;
  public queryDates = new QueryDates();

  public async findAll(
    searchParam?: Record<string, unknown>,
    isInclude?: boolean
  ): Promise<FixedBookingModelType[]> {
    // eslint-disable-next-line no-useless-catch
    try {
      if (searchParam && !isInclude) {
        return await this.fixedBookingModel.findAll({
          where: { ...searchParam },
        });
      }
      if (searchParam && isInclude) {
        /**
          todo: add logic of include here
         */
        return await this.fixedBookingModel.findAll({
          ...searchParam,
        });
      } else return await this.fixedBookingModel.findAll();
    } catch (e) {
      throw e;
    }
  }
}

export default new FixedBookingService();
