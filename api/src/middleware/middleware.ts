import { Console } from 'console';

import express, { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { DateTime } from 'luxon';

import { filterDays_updateDate, retrieveAvailability } from '../../utils';
import { FixedBookingModelType } from '../database/models/fixedBooking.model';
import {
  ResponseWithAvalType,
  ResponseWithUserType,
} from '../routes/interfaces/interfaces';
import authService from '../services/AuthService';
import parseDatabaseAvailability from '../services/AvailabilitiesService';
import bookingService from '../services/BookingService';
import { ErrorService } from '../services/ErrorService';
import fixedBookingService from '../services/FixedBookingService';
import userService from '../services/UserService';
import { DayAvailabilityType } from '../types/types';

const avalDefault = require('../config/availabilitiesDefault.config.json');

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
      next(ErrorService.badRequest('this hour is already booked'));
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
  const avalRange: { start: string; end: string }[] = [
    ...req.body.TimeRangeType,
  ];
  try {
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

    /**
     *
     * parse bookings from JS object date to string
     *
     */

    const parsedBookings = _.map(bookings.flat(), (e: any) => {
      return {
        ...e,
        start: DateTime.fromJSDate(e.start).toISO(),
        end: DateTime.fromJSDate(e.end).toISO(),
      };
    });

    /**
     *
     * get all fixed booking and update their date considering the date coming from client.
     * fixedBooking dont have date but just hours!
     *
     */

    const fixedBks = await fixedBookingService.findAll();

    const mapFixedBks = fixedBks.map((book: FixedBookingModelType) => {
      return {
        day: book.day,
        availability: [{ start: book.start, end: book.end }],
      };
    });

    const parsedFixedBookings = filterDays_updateDate(
      mapFixedBks,
      avalRange
    ).map((day) => day.availability);

    /**
     *
     * join all bookings in a single array
     *
     */

    const joinedBookings = [...parsedBookings, ...parsedFixedBookings.flat()];

    /**
     *
     * get weekAvalSetting and create dynamicAval. If there are not weekAvalSetting create them.
     *
     */

    const daysAvailabilities: DayAvailabilityType[] =
      await parseDatabaseAvailability(avalDefault);

    /**
     *
     * join all the datas togheter and get availabilities, hopefully all works
     *
     */

    const availabilities = retrieveAvailability(
      {
        bookings: joinedBookings,
      },
      daysAvailabilities,
      avalRange
    );

    res.availabilities = availabilities;
    next();
  } catch (e: any) {
    next(e);
  }
};

const requestHasPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  if (!password) {
    next(ErrorService.badRequest('password is missing'));
  } else next();
};

const userExist = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const user = await userService.findOne(email);
    if (!user) {
      next(ErrorService.badRequest('user not found'));
    }
    //@ts-expect-error
    res.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

const loginValidation = async (
  req: Request,
  res: ResponseWithUserType,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login({ email, password });
    res.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

const createToken = async (
  req: Request,
  res: ResponseWithUserType,
  next: NextFunction
) => {
  const { email } = req.body;
  const usr = res.user;
  try {
    if (usr) {
      const userToSign = { email };
      const token = authService.generateAccessToken(userToSign);
      res.locals.jwt_secret = token;
      res.locals.jwt_type = 'Bearer';
      next();
    } else {
      next(ErrorService.badRequest('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

const authenticateToken = async (
  req: Request,
  res: Response & { user: any },
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) next(ErrorService.badRequest('User not logged in'));
  else {
    const payload = token && (await googleAuth(token));
    try {
      if (payload) {
        res.user = { email: payload.email };
        next();
      } else {
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
          (err: any, decoded: any) => {
            if (err) {
              next(ErrorService.badRequest('Access not authorized'));
            }
            res.user = decoded;
            next();
          }
        );
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  createToken,
  userExist,
  getAvailability,
  bookExist,
  requestHasPassword,
  loginValidation,
  authenticateToken,
  googleAuth,
};
