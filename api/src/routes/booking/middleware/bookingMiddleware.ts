import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import { Op } from 'sequelize';

import db from '../../../database/models/db';
import bookingService from '../../../services/bookingService/BookingService';

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

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export const sendTelegramNotification = (message: any) => {
  postData(
    'https://api.telegram.org/bot5384234838:AAHk6FpZ89MJSXV1IPrDSqFA7rwx5xn_fNw/sendMessage',
    {
      chat_id: 1918231997,
      text: message,
    }
  ).then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
};
