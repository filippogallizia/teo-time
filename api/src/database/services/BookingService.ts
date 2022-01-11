import { Request, Response } from 'express';
import { Op } from 'sequelize';

import { BookingDTO } from '../../interfaces/BookingDTO';
import { UserDTO } from '../../interfaces/UserDTO';
import { ApiError } from '../../services/ErrorHanlderService';

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
  bookingModel: any;
  public queryDates = new QueryDates();
  constructor(model?: any) {
    this.bookingModel = model;
  }

  public async findOne(req: Request): Promise<any> {
    const { start, end } = req.body;
    try {
      return await this.bookingModel.findOne({ where: { start, end } });
    } catch (error) {
      throw ApiError.badRequest('Booking not found');
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
    searchParam: Record<string, unknown>
  ): Promise<RecordType[]> {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.bookingModel.findAll({
        where: { ...searchParam },
      });
    } catch (e) {
      throw e;
    }
  }
}

export default BookingService;
