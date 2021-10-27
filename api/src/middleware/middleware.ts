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
  const { email, phoneNumber, name } = req.body;

  // check if  user entered email and if not send error message
  if (!email) {
    res.status(400).send({
      success: false,
      error: {
        message: 'email is missing',
      },
    });
  } else {
    try {
      // check for an existing user
      const user = await User.findOne({
        where: {
          email,
        },
      }).catch((e: any) => {
        res.status(500).send({
          success: false,
          error: {
            message: e,
          },
        });
      });
      if (user) {
        // if a user exist, check if is link is still valid and if it is not send a new one
        if (user.passwordExpiry < DateTime.now()) {
          const msg = {
            to: email,
            from: process.env.EMAIL, // Use the email address or domain you verified above
            subject: 'teo-time',
            text: `email: ${user.email}  name: ${user.name} `,
            html: `<div><a href=http://localhost:3000/homepage/booking?otp=${OTP}>LOG IN HERE</a></div>`,
          };
          // if the link is not valid update user otp and passwordExpiry
          await user.update(
            {
              password: OTP,
              passwordExpiry: DateTime.now().plus({ minutes: 10 }),
            },
            {
              where: {
                email,
              },
            }
          );
          //send link
          const sendMessage = async () => {
            try {
              await sgMail.send(msg);
              res.status(500).send({
                success: false,
                error: {
                  message: `'your link was expired, we sent you a new email',`,
                },
              });
            } catch (e: any) {
              throw e;
            }
          };
          sendMessage();
        } else {
          // if the link is valid send a message saing to check email
          res.status(500).send({
            success: false,
            error: {
              message: 'user exist already, check your previous email',
            },
          });
        }
      } else {
        // if there is no user yet move forward to create a new one
        next();
      }
    } catch (e: any) {
      res.status(500).send({
        success: false,
        error: { message: `this error occured ${e}` },
      });
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

const checkForOtp = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const OTP = req.query.otp;
  // check for a query parameter if not return not authorized
  if (!OTP) {
    res.status(404).send({
      success: false,
      error: {
        message: 'not authorized',
      },
    });
  } else {
    // if query parameter exist, then check for a user
    const user = await User.findOne({
      where: {
        password: OTP,
      },
    }).catch((e: any) => {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    });
    // if the user exist, than check if is OTP is not expired
    if (user && user.passwordExpiry < DateTime.now()) {
      res.status(404).send({
        success: false,
        error: {
          message: 'the link is expired',
        },
      });
    } else if (user && user.passwordExpiry > DateTime.now()) {
      next();
    } else {
      res.status(500).send({
        success: false,
        error: {
          message: 'user not found',
        },
      });
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

module.exports = {
  userExist,
  checkForOtp,
  getAvailability,
  checkForBookingAlreadyExisting,
  checkForBookingOutOfRange,
};
