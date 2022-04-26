import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { DateTime } from 'luxon';

import avalDefault from '../config/availabilitiesDefault.config.json';
import {
  ResponseWithAvalType,
  ResponseWithUserType,
} from '../routes/interfaces/interfaces';
import authService from '../services/authService/AuthService';
import { parseDatabaseAvailability } from '../services/availabilityService/AvailabilitiesService';
import bookingService from '../services/bookingService/BookingService';
import { ErrorService } from '../services/errorService/ErrorService';
import FixedBookingService from '../services/fixedBookingService/FixedBookingService';
import { FixedBookingDTO } from '../services/fixedBookingService/interfaces';
import userService from '../services/userService/UserService';
import { DayAvailabilityType } from '../types/types';
import {
  DATE_TO_FULL_DAY,
  filterDays_updateDate,
  retrieveAvailability,
} from '../utils';

// chronJob to delete past bookings

// google verify token

// TODO -> enable this comment to use client google login
//const client = new OAuth2Client(process.env.GOOGLE_CALENDAR_CLIENT_ID);
//export const googleAuth = async (token: string) => {
//  try {
//    const ticket = await client.verifyIdToken({
//      idToken: token,
//      //@ts-expect-error
//      audience: process.env.GOOGLE_CALENDAR_CLIENT_ID,
//    });
//    const payload: any = ticket.getPayload();
//    if (payload) {
//      const { email, name } = payload;
//      return { email, name };
//    } else return undefined;
//  } catch (e) {
//    console.log(e);
//  }
//};

export const bookExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startRange = req.body.start;
  const endRange = req.body.end;
  try {
    const bookings = await Promise.all([
      bookingService.findAll({
        where: bookingService.queryDates.inBtwStartAndEnd(startRange, endRange),
      }),
      bookingService.findAll({
        where: bookingService.queryDates.inBtwStartAndSmallerEnd(
          startRange,
          endRange
        ),
      }),
      bookingService.findAll({
        where: bookingService.queryDates.smallerStartAndBiggerEnd(
          startRange,
          endRange
        ),
      }),
      bookingService.findAll({
        where: bookingService.queryDates.smallerStartInBtwEnd(
          startRange,
          endRange
        ),
      }),
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
  //@ts-expect-error
  const start = req.query.start && req.query.start.split(' ').join('+');
  //@ts-expect-error
  const end = req.query.end && req.query.end.split(' ').join('+');

  const avalRange: { start: string; end: string }[] = [
    {
      start: (start as string) ?? '',
      end: (end as string) ?? '',
    },
  ];
  try {
    const start = avalRange[0].start;
    const end = avalRange[0].end;

    const bookings = await Promise.all([
      bookingService.findAll({
        where: bookingService.queryDates.inBtwStartAndEnd(start, end),
      }),
      bookingService.findAll({
        where: bookingService.queryDates.inBtwStartAndSmallerEnd(start, end),
      }),
      bookingService.findAll({
        where: bookingService.queryDates.smallerStartAndBiggerEnd(start, end),
      }),
      bookingService.findAll({
        where: bookingService.queryDates.smallerStartInBtwEnd(start, end),
      }),
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
    const fixedBks = await FixedBookingService.findAll();

    const mapFixedBks = fixedBks
      /**
       * first we filter for exceptionDate
       */
      .filter((book: FixedBookingDTO) => {
        const requestedAvail = DATE_TO_FULL_DAY(start);
        const fixedBookException = DATE_TO_FULL_DAY(book.exceptionDate);
        return requestedAvail !== fixedBookException;
      })
      .map((book: FixedBookingDTO) => {
        return {
          day: book.day,
          availability: [{ start: book.start, end: book.end }],
        };
      });

    /**
     * group the fixedBkgs.
     * example: [{day: monday, aval: [..]}, {day: monday, aval: [..]}, {day: tuesday, aval: [..]}] => [{day: monday, aval: [.. ..]}, {day: tuesday, aval: [..]}]
     */
    const fixedBksGrouped = mapFixedBks.reduce((acc: any, cv) => {
      if (acc.length > 0 && _.find(acc, (el) => el.day === cv.day)) {
        acc[acc.length - 1].availability = [
          ...acc[acc.length - 1].availability,
          ...cv.availability,
        ];
      } else {
        acc.push(cv);
      }
      return acc;
    }, []);

    const parsedFixedBookings = filterDays_updateDate(
      fixedBksGrouped,
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
      //@ts-expect-error
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
  if (!token) next(ErrorService.unauthorized('Unauthorized'));
  else {
    // TODO -> enable this comment to use client google login
    //const payload = token && (await googleAuth(token));
    try {
      // TODO -> enable this comment to use client google login
      //if (payload) {
      //    res.user = { email: payload.email };
      //    next();
      //  } else {
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: any, decoded: any) => {
          if (err || !decoded) {
            next(ErrorService.unauthorized('Unauthorized'));
            return;
          }
          res.user = decoded.data;
          next();
        }
      );
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
  //googleAuth,
};
