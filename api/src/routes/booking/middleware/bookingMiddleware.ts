import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';

import bookingService from '../../../services/bookingService/BookingService';

const db = require('../../../database/models/db');

const User = db.user;

export const filterBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = req.query;

    let bks;

    if (start && end) {
      bks = await bookingService.findAll({
        include: {
          model: User,
          as: 'user',
        },
        where: {
          end: {
            [Op.lte]: end,
          },
          start: {
            [Op.gte]: start,
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
