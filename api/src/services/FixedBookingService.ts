import { RecordType } from './UserService';
const db = require('../database/models/db');

class FixedBookingService {
  fixedBookingModel = db.FixedBookings;

  public async findAll(searchParam?: Record<string, unknown>): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      if (searchParam) {
        return await this.fixedBookingModel.findAll({
          where: { ...searchParam },
        });
      } else return await this.fixedBookingModel.findAll();
    } catch (e) {
      throw e;
    }
  }
}

export default new FixedBookingService();
