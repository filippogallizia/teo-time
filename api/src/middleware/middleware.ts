import express, { NextFunction } from 'express';
import { Op } from 'sequelize';
import { getAvailabilityFromBooking } from '../helpers/retrieveAvaliability';
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
      }).catch((e) => {
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
          mySgMail.sendMessage(res);
        } else {
          // if the link is valid send a message saing to check email
          res.status(409).send('user already exists, check your email');
        }
      } else {
        // if there is no user yet move forward to create a new one
        next();
      }
    } catch (e) {
      res.status(500).send(`this error occured ${e.message}`);
    }
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
      res.status(500).send(`this error occured ${e.message}`);
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
  const startRange = req.body.start;
  const endRange = req.body.end;
  try {
    const filo = await BookingGrid.findAll({
      where: {
        start: {
          [Op.gte]: startRange,
        },
        end: {
          [Op.lte]: endRange,
        },
      },
    }).catch((e: any) => {
      res.status(500).send(e);
    });

    const availabilities = getAvailabilityFromBooking(
      {
        bookings: [
          {
            id: 1,
            start: '2021-10-05T07:00:00.000+01:00',
            end: '2021-10-05T08:30:00.000+01:00',
            createdAt: '2021-10-14T16:49:47.000Z',
            updatedAt: '2021-10-14T16:49:47.000Z',
          },
          {
            id: 1,
            start: '2021-10-05T10:00:00.000+01:00',
            end: '2021-10-05T11:30:00.000+01:00',
            createdAt: '2021-10-14T16:49:47.000Z',
            updatedAt: '2021-10-14T16:49:47.000Z',
          },
        ],
      },
      generalAvaliabilityRules
    );

    //@ts-expect-error
    res.availabilities = availabilities;
    next();
  } catch (e) {
    res.send('e');
  }
};

module.exports = {
  userExist,
  checkForOtp,
  getAvailability,
};
