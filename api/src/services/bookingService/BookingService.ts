import { Request } from 'express';
import { includes } from 'lodash';
import { Op } from 'sequelize';

import { BookingModel } from '../../database/models/booking.model';
import { BookingDTO } from '../../interfaces/BookingDTO';
import { UserDTO } from '../../interfaces/UserDTO';
import { ErrorService } from '../errorService/ErrorService';

const db = require('../../database/models/db');

export type RecordType = UserDTO | BookingDTO;

export class QueryDates {
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
        [Op.lte]: start,
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
    try {
      return await this.bookingModel.create({
        start,
        end,
        isHoliday,
        localId,
      });
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async findAll(param?: {
    include?: Record<string, unknown>;
    where?: Record<string, unknown>;
    order?: any[];
  }): Promise<BookingModel & { user?: any; userId: number }[]> {
    try {
      const parameters = {
        include: param?.include,
        where: param?.where,
        order: param?.order,
      };

      const optionalParameters =
        Object.keys(parameters).length > 0 ? parameters : undefined;

      return await this.bookingModel.findAll(optionalParameters);
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }
}

export default new BookingService();
