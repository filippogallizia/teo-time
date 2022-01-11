import express, { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { createDynamicAval, filterDays_updateDate } from '../../utils';
import BookingService from '../database/services/BookingService';
import UserService from '../database/services/UserService';
import { retrieveAvailability } from '../helpers/retrieveAvaliability';
import {
  ResponseWithAvalType,
  ResponseWithUserType,
} from '../routes/interfaces/interfaces';
import AuthService from '../services/auth';
import { ApiError } from '../services/ErrorHanlderService';
import { WorkSetting } from '../types/types';

//const db = require('../database/models/db');
const db = require('../database/models/db');

const avalDefault = require('../config/availabilitiesDefault.config.json');

const WeekavalSettings = db.WeekavalSettings;
const FixedBookings = db.FixedBookings;

const bookingService = new BookingService(db.Bookings);
const userService = new UserService(db.user);

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startRange = req.body.start;
  const endRange = req.body.end;
  try {
    const bookings = await Promise.all([
      bookingService.findAll(
        bookingService.queryDates.inBtwStartAndEnd(startRange, endRange)
      ),
      bookingService.findAll(
        bookingService.queryDates.inBtwStartAndSmallerEnd(startRange, endRange)
      ),
      bookingService.findAll(
        bookingService.queryDates.smallerStartAndBiggerEnd(startRange, endRange)
      ),
      bookingService.findAll(
        bookingService.queryDates.smallerStartInBtwEnd(startRange, endRange)
      ),
    ]);

    if (bookings.flat().length > 0) {
      ApiError.badRequest('this hour is already booked');
    } else next();
  } catch (e: any) {
    next(e);
  }
};

const getAvailability = async (
  req: Request,
  res: ResponseWithAvalType,
  next: NextFunction
) => {
  const avalRange = [...req.body.TimeRangeType];
  try {
    // check conditions inside bookings

    const start = avalRange[0].start;
    const end = avalRange[0].end;

    const bookings = await Promise.all([
      bookingService.findAll(
        bookingService.queryDates.inBtwStartAndEnd(start, end)
      ),
      bookingService.findAll(
        bookingService.queryDates.inBtwStartAndSmallerEnd(start, end)
      ),
      bookingService.findAll(
        bookingService.queryDates.smallerStartAndBiggerEnd(start, end)
      ),
      bookingService.findAll(
        bookingService.queryDates.smallerStartInBtwEnd(start, end)
      ),
    ]);

    // parse bookings from JS object date to string

    const parsedBookings = _.map(bookings.flat(), (e: any) => {
      return {
        ...e,
        start: DateTime.fromJSDate(e.start).toISO(),
        end: DateTime.fromJSDate(e.end).toISO(),
      };
    });

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
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
};

const userExist = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!password) {
    next(ApiError.badRequest('password is missing'));
  }
  try {
    const user = userService.findOne(email).catch((e: any) => {
      next(e);
    });
    //@ts-expect-error
    res.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

const createToken = (
  req: Request,
  res: ResponseWithUserType,
  next: NextFunction
) => {
  const { email } = req.body;

  userService
    .findOne(email)
    .then((usr: any) => {
      if (usr) {
        const userToSign = { email };
        const token = AuthService.generateAccessToken(userToSign);
        res.locals.jwt_secret = token;
        res.locals.jwt_type = 'Bearer';
        next();
      } else {
        next(ApiError.badRequest('User not found'));
      }
    })
    .catch((e: any) => {
      next(e);
    });
};

const authenticateToken = (
  req: Request,
  res: Response & { user: any },
  next: NextFunction
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
