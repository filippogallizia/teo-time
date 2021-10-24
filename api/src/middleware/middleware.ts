import express, { NextFunction } from 'express';
import { Op } from 'sequelize';
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

const OTP = v4();
const BookingGrid = db.bookingGrid;

const userExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { email } = req.body;
  // check if  user entered email and if not send error message
  if (!email) {
    res.status(400).send('email is missing');
  } else {
    try {
      // check for an existing user
      const user = await User.findOne({
        where: {
          email,
        },
      }).catch((e: any) => {
        res.status(500).send(`this error occured ${e.message}`);
      });
      if (user) {
        // if a user exist, check if is link is still valid and if it is not send a new one
        if (user.passwordExpiry < DateTime.now()) {
          // if the link is not valid update user otp and passwordExpiry
          await user.update(
            {
              password: OTP,
              passwordExpiry: DateTime.now().plus({ minutes: 1 }),
            },
            {
              where: {
                email,
              },
            }
          );
          //send link
          const mySgMail = new ClassSgMail(email, OTP);
          mySgMail.sendMessage(res, OTP);
        } else {
          // if the link is valid send a message saing to check email
          res.status(409).send('user already exists, check your email');
        }
      } else {
        // if there is no user yet move forward to create a new one
        next();
      }
    } catch (e: any) {
      res.status(500).send(`this error occured ${e.message}`);
    }
  }
};

export const checkForBookingAlreadyExisting = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { start, end } = req.body;
  try {
    const bookingAlreadyExist = await BookingGrid.findOne({
      where: { start, end },
    });
    if (bookingAlreadyExist) {
      res.status(404).send('This hour is already booked');
    } else next();
  } catch (e) {
    res.status(500).send(JSON.stringify(e));
  }
};

export const checkForBookingOutOfRange = async (
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
    res.status(400).send('the booking doesnt match a slot');
  } else {
    next();
  }
};

const checkForOtp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const OTP = req.query.otp;
  // check for a query parameter if not return not authorized
  if (!OTP) {
    res.status(404).send('not authorized');
  } else {
    // if query parameter exist, then check for a user
    const user = await User.findOne({
      where: {
        password: OTP,
      },
    }).catch((e: any) => {
      res.status(500).send({ message: e.message });
    });
    // if the user exist, than check if is OTP is not expired
    if (user && user.passwordExpiry < DateTime.now()) {
      res.status(400).send('the link is expired');
    } else if (user && user.passwordExpiry > DateTime.now()) {
      next();
    } else {
      res.status(400).send('user not found');
    }
  }
};

const getAvailability = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const timeRange = [...req.body.timeRange];
  try {
    const myBookings = await BookingGrid.findAll({
      where: {
        start: {
          [Op.gte]: timeRange[0].start,
        },
        end: {
          [Op.lte]: timeRange[0].end,
        },
      },
    }).catch((e: any) => {
      res.status(500).send({ message: e.message });
    });
    // ONE TO MANY IMPLEMANTATION

    // if (myBookings.length > 0) {
    //   BookingGrid.findOne({
    //     where: { start: '2021-10-21T06:00:00.000Z' },
    //   })
    //     .then((bkd: any) => {
    //       User.findOne({ where: { email: 'galliziafilippo' } })
    //         .then((usr: any) => {
    //           bkd.setUser(usr).catch((e) => {
    //             console.log(e);
    //           });
    //         })
    //         .catch((e) => {
    //           console.log(e);
    //         });
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // }

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
  } catch (e) {
    console.log(e, 'e');
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  userExist,
  checkForOtp,
  getAvailability,
  checkForBookingAlreadyExisting,
  checkForBookingOutOfRange,
};
