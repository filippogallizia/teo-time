import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';

import bookingService from '../../../services/bookingService/BookingService';

const db = require('../../../database/models/db');

const User = db.user;

export const requestHasPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    let bks;

    if (startDate && endDate) {
      bks = await bookingService.findAll({
        include: {
          model: User,
          as: 'user',
        },
        where: {
          end: {
            [Op.lte]: endDate,
          },
          start: {
            [Op.gte]: startDate,
          },
        },
      });
    } else {
      bks = await bookingService.findAll({
        include: {
          model: User,
          as: 'user',
        },
        order: [['start', 'DESC']],
      });
    }
    //@ts-expect-error
    res.bks = bks;
    next();
  } catch (e) {
    next(e);
  }
};
