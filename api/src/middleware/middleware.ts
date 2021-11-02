import express, { NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import { Op } from 'sequelize';
import { any } from 'sequelize/types/lib/operators';
import { filterForDays, HOUR_MINUTE_FORMAT } from '../../utils';
const _ = require('lodash');
import { retrieveAvailability } from '../helpers/retrieveAvaliability';
const db = require('../models/db');
const { DateTime } = require('luxon');
const User = db.user;
const sgMail = require('@sendgrid/mail');
const generalAvaliabilityRules = require('../config/timeConditions.config.json');
const { v4 } = require('uuid');
const ClassSgMail = require('../config/sgMail.config');

const Bookings = db.Bookings;

export const bookExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { start, end } = req.body;
  try {
    const bookingAlreadyExist = await Bookings.findOne({
      where: { start, end },
    });
    if (bookingAlreadyExist) {
      res.status(404).send({
        success: false,
        error: {
          message: 'This hour is already booked',
        },
      });
    } else next();
  } catch (e: any) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
};

export const bookOutRange = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { start, end } = req.body;
  const timeRange = [{ start, end }];
  const r = filterForDays(generalAvaliabilityRules, timeRange);
  // we assume that the range is not bigger than one day
  const findedSlot = _.intersectionWith(
    r[0].availability,
    [{ start, end }],
    (a: TimeRangeTypeJson, b: TimeRangeTypeJson) => {
      return (
        HOUR_MINUTE_FORMAT(a.start) == HOUR_MINUTE_FORMAT(b.start) &&
        HOUR_MINUTE_FORMAT(a.end) == HOUR_MINUTE_FORMAT(b.end)
      );
    }
  );
  if (findedSlot.length === 0) {
    res.status(404).send({
      success: false,
      error: {
        message: 'the booking doesnt match a slot',
      },
    });
  } else {
    next();
  }
};

const getAvailability = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const timeRange = [...req.body.timeRange];
  try {
    const myBookings = await Bookings.findAll({
      where: {
        start: {
          [Op.gte]: timeRange[0].start,
        },
        end: {
          [Op.lte]: timeRange[0].end,
        },
      },
    }).catch((e: any) => {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    });

    const parseBooking = _.map(myBookings, (e: any) => {
      return {
        ...e,
        start: DateTime.fromJSDate(e.start).toISO(),
        end: DateTime.fromJSDate(e.end).toISO(),
      };
    });

    const availabilities = retrieveAvailability(
      {
        bookings: parseBooking,
      },
      generalAvaliabilityRules,
      timeRange
    );
    //@ts-expect-error
    res.availabilities = availabilities;
    next();
  } catch (e: any) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
};

const userExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { email, password } = req.body;
  if (!password) {
    res.status(500).send({
      success: false,
      error: {
        message: 'password is missing',
      },
    });
  }
  try {
    const user = await User.findOne({
      where: { email },
    }).catch((e: any) => {
      throw e;
    });
    //@ts-expect-error
    res.user = user;
    next();
  } catch (e) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
};

// LOG: anyIN

function generateAccessToken(value: any) {
  return jwt.sign(value, process.env.ACCESS_TOKEN_SECRET);
}

const createToken = (
  req: express.Request,
  res: express.Response & { user: any },
  next: express.NextFunction
) => {
  const { email, phoneNumber, name, password } = req.body;

  User.findOne({
    where: { email },
  })
    .then((usr: any) => {
      if (usr) {
        const userToSign = { email, password, role: usr.role };
        res.locals.jwt_secret = generateAccessToken(userToSign);
        res.locals.jwt_type = 'Bearer';
        next();
      } else {
        res.status(500).send({
          success: false,
          error: {
            message: 'user not found',
          },
        });
      }
    })
    .catch((e: any) => {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    });
};

const authenticateToken = (
  req: express.Request,
  res: express.Response & { user: any },
  next: express.NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    return res.status(500).send({
      success: false,
      error: {
        message: 'non hai effettuato il login',
      },
    });
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err: any, decoded: any) => {
      if (err)
        return res.status(500).send({
          success: false,
          error: {
            message: 'accesso non autorizzato',
          },
        });
      res.user = decoded;
      next();
    }
  );
};

module.exports = {
  createToken,
  userExist,
  getAvailability,
  bookExist,
  bookOutRange,
  authenticateToken,
};
