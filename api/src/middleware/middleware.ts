import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

import { createDynamicAval, filterDays_updateDate } from '../../utils';
import { retrieveAvailability } from '../helpers/retrieveAvaliability';
import { ResponseWithAvalType } from '../routes/interfaces/interfaces';
import { WorkSetting } from '../types/types';

const avalDefault = require('../config/availabilitiesDefault.config.json');
const db = require('../models/db');

const User = db.user;
const WeekavalSettings = db.WeekavalSettings;
const Bookings = db.Bookings;
const FixedBookings = db.FixedBookings;

// chronJob to delete past bookings

// google verify token

const client = new OAuth2Client(process.env.GOOGLE_CALENDAR_CLIENT_ID);

export const googleAuth = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      //@ts-expect-error
      audience: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    });
    const payload: any = ticket.getPayload();
    if (payload) {
      const { email, name } = payload;
      return { email, name };
    } else return undefined;
  } catch (e) {
    console.log(e);
  }
};

export const bookExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const startRange = req.body.start;
  const endRange = req.body.end;
  try {
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

    const myBookings2 = await Bookings.findAll({
      where: {
        start: {
          [Op.lte]: startRange,
        },
        end: {
          [Op.between]: [startRange, endRange],
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const myBookings3 = await Bookings.findAll({
      where: {
        start: {
          [Op.lte]: startRange,
        },
        end: {
          [Op.gte]: endRange,
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const myBookings4 = await Bookings.findAll({
      where: {
        start: {
          [Op.between]: [startRange, endRange],
        },
        end: {
          [Op.gte]: endRange,
        },
      },
    }).catch((e: any) => {
      throw e;
    });

    const result = [
      ...bookingsAlreadyExist,
      ...myBookings2,
      ...myBookings3,
      ...myBookings4,
    ];

    if (result.length > 0) {
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
  res: ResponseWithAvalType,
  next: express.NextFunction
) => {
  const avalRange = [...req.body.TimeRangeType];
  try {
    // check conditions inside bookings

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

    // parse bookings from JS object date to string

    const parsedBookings = _.map(
      [...myBookings, ...myBookings2, ...myBookings3, ...myBookings4],
      (e: any) => {
        return {
          ...e,
          start: DateTime.fromJSDate(e.start).toISO(),
          end: DateTime.fromJSDate(e.end).toISO(),
        };
      }
    );

    console.log(parsedBookings, 'parsedBookings');

    // get fixedBooking from database and change their date using avalRange date

    const fixedBks = await FixedBookings.findAll().catch((e: any) =>
      console.log(e)
    );

    const parsedFixedBookings = filterDays_updateDate(fixedBks, avalRange).map(
      (day) => day.availability
    );

    // join all bookings in a single array

    const joinedBookings = [...parsedBookings, ...parsedFixedBookings.flat()];

    // get weekAvalSetting and create dynamicAval. If there are not weekAvalSetting create them.

    const weekavalSetting = await WeekavalSettings.findAll()
      .then((daySetting: WorkSetting[]) => {
        if (daySetting.length > 0) {
          const result = daySetting.map((day: WorkSetting) => {
            return {
              day: day.day,
              availability: createDynamicAval(
                { start: day.workTimeStart, end: day.workTimeEnd },
                { start: day.breakTimeStart, end: day.breakTimeEnd },
                {
                  hours: Number(day.eventDurationHours),
                  minutes: Number(day.eventDurationMinutes),
                },
                {
                  hours: Number(day.breakTimeBtwEventsHours),
                  minutes: Number(day.breakTimeBtwEventsMinutes),
                }
              ),
            };
          });
          return result;
        } else {
          console.log(avalDefault, 'PORCO CULO');
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

    // joing all the datas togheter and get availabilities, hopefully all works

    const availabilities = retrieveAvailability(
      {
        bookings: joinedBookings,
      },
      { weekAvalSettings: weekavalSetting },
      avalRange
    );
    res.availabilities = availabilities;
    next();
  } catch (e: any) {
    console.log(e, 'e');
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
  return jwt.sign(value, process.env.ACCESS_TOKEN_SECRET as string);
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
  googleAuth(token)
    .then((payload: any) => {
      if (payload) {
        res.user = { email: payload.email };
        next();
      } else {
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
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

module.exports = {
  createToken,
  userExist,
  getAvailability,
  bookExist,
  authenticateToken,

  googleAuth,
};
