import { Request } from 'express';

import { ErrorService } from '../errorService/ErrorService';
import { FixedBookingDTO } from './interfaces';

const db = require('../../database/models/db');

export type RecordType = FixedBookingDTO;

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

  public async findAll(
    searchParam?: Record<string, unknown>,
    isInclude?: boolean
  ): Promise<FixedBookingDTO[]> {
    try {
      if (searchParam && !isInclude) {
        return await this.fixedBookingsModel.findAll({
          where: { ...searchParam },
        });
      }
      if (searchParam && isInclude) {
        /**
          todo: add logic of include here
         */
        return await this.fixedBookingsModel.findAll({
          ...searchParam,
        });
      } else return await this.fixedBookingsModel.findAll();
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
