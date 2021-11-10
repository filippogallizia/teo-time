import express, { NextFunction } from 'express';
import { Op } from 'sequelize';
import { retrieveAvailability } from '../helpers/retrieveAvaliability';
import { WorkSetting } from '../types/types';
const avalDefault = require('../config/availabilitiesDefault.config.json');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const db = require('../models/db');
const {
  result,
  compareTwoDatesWithK,
} = require('../helpers/createDynamicAvailiabilityRules');
const { DateTime } = require('luxon');
const sgMail = require('@sendgrid/mail');
const weekAvalSettings = require('../config/timeConditions.config.json');
const { v4 } = require('uuid');
const ClassSgMail = require('../config/sgMail.config');

const User = db.user;
const WeekavalSettings = db.WeekAvailabilitiesSettings;
const Bookings = db.Bookings;

export const bookExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const startRange = req.body.start;
  const endRange = req.body.end;
  try {
    // const bookingAlreadyExist = await Bookings.findOne({
    //   where: { start, end },
    // });
    const bookingsAlreadyExist = await Bookings.findAll({
      where: {
        start: {
          [Op.gte]: startRange,
        },
        end: {
          [Op.lte]: endRange,
        },
      },
    });
    if (bookingsAlreadyExist.length > 0) {
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

const getAvailability = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const avalRange = [...req.body.TimeRangeType];
  try {
    const myBookings = await Bookings.findAll({
      where: {
        start: {
          [Op.gte]: avalRange[0].start,
        },
        end: {
          [Op.lte]: avalRange[0].end,
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const myBookings2 = await Bookings.findAll({
      where: {
        start: {
          [Op.lte]: avalRange[0].start,
        },
        end: {
          [Op.between]: [avalRange[0].start, avalRange[0].end],
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const myBookings3 = await Bookings.findAll({
      where: {
        start: {
          [Op.lte]: avalRange[0].start,
        },
        end: {
          [Op.gte]: avalRange[0].end,
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const myBookings4 = await Bookings.findAll({
      where: {
        start: {
          [Op.between]: [avalRange[0].start, avalRange[0].end],
        },
        end: {
          [Op.gte]: avalRange[0].end,
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const parseBooking = _.map(
      [...myBookings, ...myBookings2, ...myBookings3, ...myBookings4],
      (e: any) => {
        return {
          ...e,
          start: DateTime.fromJSDate(e.start).toISO(),
          end: DateTime.fromJSDate(e.end).toISO(),
        };
      }
    );

    const weekavalSetting = await WeekavalSettings.findAll()
      .then((daySetting: WorkSetting[]) => {
        if (daySetting.length > 0) {
          const result = daySetting.map((day: WorkSetting) => {
            return {
              day: day.day,
              availability: compareTwoDatesWithK(
                { start: day.workTimeStart, end: day.workTimeEnd },
                { start: day.breakTimeStart, end: day.breakTimeEnd },
                {
                  hours: day.eventDurationHours,
                  minutes: day.eventDurationMinutes,
                },
                {
                  hours: day.breakTimeBtwEventsHours,
                  minutes: day.breakTimeBtwEventsMinutes,
                }
              ),
            };
          });
          return result;
        } else {
          avalDefault.weekAvalSettings.map((day: any) => {
            WeekavalSettings.create({
              day: day.day,
              workTimeStart: day.parameters.workTimeRange.start,
              workTimeEnd: day.parameters.workTimeRange.end,
              breakTimeStart: day.parameters.breakTimeRange.start,
              breakTimeEnd: day.parameters.breakTimeRange.end,
              eventDurationHours: day.parameters.eventDuration.hours,
              eventDurationMinutes: day.parameters.eventDuration.minutes,
              breakTimeBtwEventsHours: day.parameters.breakTimeBtwEvents.hours,
              breakTimeBtwEventsMinutes:
                day.parameters.breakTimeBtwEvents.minutes,
            }).catch((e: any) => {
              throw e;
            });
          });
        }
      })
      .catch((e: any) => {
        throw e;
      });

    const availabilities = retrieveAvailability(
      {
        bookings: parseBooking,
      },
      { weekAvalSettings: weekavalSetting },
      avalRange
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
      where: { email, password },
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
  const { email } = req.body;

  User.findOne({
    where: { email },
  })
    .then((usr: any) => {
      if (usr) {
        const userToSign = { email };
        res.locals.jwt_secret = generateAccessToken(userToSign);
        res.locals.jwt_type = 'Bearer';
        next();
      } else {
        return res.status(500).send({
          success: false,
          error: {
            message: 'nessun user trovato',
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
  authenticateToken,
};
