import { Request } from 'express';

import { ErrorService } from '../errorService/ErrorService';
import { FixedBookingDTO } from './interfaces';

const db = require('../../database/models/db');

export type RecordType = FixedBookingDTO;
type Props = {
  searchParam: any;
};

//TODO -> IMPLEMENT VALIDATION FOR NOT HAVING DOUBLE BOOKING SAME HOUR

class FixedBookingService {
  fixedBookingsModel = db.FixedBookings;

  public async findOne(req: Request): Promise<any> {
    const { start, end } = req.body;
    try {
      return await this.fixedBookingsModel.findOne({ where: { start, end } });
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }

  public async create(req: Request): Promise<any> {
    const { start, end, day, email, exceptionDate }: FixedBookingDTO =
      req.body.fixedBks;
    try {
      await this.fixedBookingsModel.create({
        day,
        email,
        end,
        start,
        exceptionDate,
      });
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async findAll(param?: {
    searchParam?: any;
    sortRule?: any;
  }): Promise<FixedBookingDTO[]> {
    try {
      if (param && param.searchParam) {
        return await this.fixedBookingsModel.findAll({
          where: { ...param.searchParam },
        });
      }
      if (param && param.sortRule) {
        return await this.fixedBookingsModel.findAll(param.sortRule);
      } else return await this.fixedBookingsModel.findAll();
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async findAllSorted(
    sortRule: Record<string, unknown>
  ): Promise<FixedBookingDTO[]> {
    try {
      return await this.fixedBookingsModel.findAll(sortRule);
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async destroy(req: Request): Promise<0 | 1> {
    const id = req.query.id;

    try {
      return await this.fixedBookingsModel.destroy({ where: { id } });
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }

  public async update(req: Request): Promise<0 | 1> {
    const { start, end, day, email, id, exceptionDate }: FixedBookingDTO =
      //@ts-expect-error
      req.fixedBks;

    try {
      return await this.fixedBookingsModel.update(
        {
          start,
          end,
          day,
          email,
          exceptionDate,
        },
        {
          where: {
            id,
          },
        }
      );
    } catch (error) {
      throw ErrorService.badRequest('Booking not found');
    }
  }
}

export default new FixedBookingService();
