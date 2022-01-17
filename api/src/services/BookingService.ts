import { Request } from 'express';
import { Op } from 'sequelize';

import { BookingModel } from '../database/models/booking.model';
import { BookingDTO } from '../interfaces/BookingDTO';
import { UserDTO } from '../interfaces/UserDTO';
import { ErrorService } from './ErrorService';

const db = require('../database/models/db');

export type RecordType = UserDTO | BookingDTO;

class QueryDates {
  public inBtwStartAndEnd(start: string, end: string) {
    return {
      start: {
        [Op.gte]: start,
      },
      end: {
        [Op.lte]: end,
      },
    };
  }
  public smallerStartInBtwEnd(start: string, end: string) {
    return {
      start: {
        [Op.lte]: start,
      },
      end: {
        [Op.between]: [start, end],
      },
    };
  }
  public smallerStartAndBiggerEnd(start: string, end: string) {
    return {
      start: {
        ['Op.lte']: start,
      },
      end: {
        [Op.gte]: end,
      },
    };
  }
  public inBtwStartAndSmallerEnd(start: string, end: string) {
    return {
      start: {
        [Op.between]: [start, end],
      },
      end: {
        [Op.gte]: end,
      },
    };
  }
}

class BookingService {
  bookingModel = db.Bookings;
  public queryDates = new QueryDates();

  public async findOne(req: Request): Promise<any> {
    const { start, end } = req.body;
    try {
      return await this.bookingModel.findOne({ where: { start, end } });
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }

  public async create(req: Request): Promise<any> {
    const { start, end, isHoliday, localId } = req.body;
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.bookingModel.create({
        start,
        end,
        isHoliday,
        localId,
      });
    } catch (e) {
      throw e;
    }
  }

  public async findAll(
    searchParam?: Record<string, unknown>,
    isInclude?: boolean
  ): Promise<BookingModel & { user?: any; userId: number }[]> {
    // eslint-disable-next-line no-useless-catch
    try {
      if (searchParam && !isInclude) {
        return await this.bookingModel.findAll({
          where: { ...searchParam },
        });
      }
      if (searchParam && isInclude) {
        /**
          todo: add logic of include here
         */
        return await this.bookingModel.findAll({
          ...searchParam,
        });
      } else return await this.bookingModel.findAll();
    } catch (e) {
      throw e;
    }
  }
}

export default new BookingService();
