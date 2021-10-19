import express from 'express';
import { Op } from 'sequelize';
import { getAvailabilityFromBooking } from '../helpers/retrieveAvaliability';

const generalAvaliabilityRules = require('../config/timeConditions.config.json');
const path = require('path');
const {
  userExist,
  checkForOtp,
  getAvailability,
  checkForBookingAlreadyExisting,
} = require('../middleware/middleware');
const db = require('../models/db');
const sgMail = require('@sendgrid/mail');
const { v4 } = require('uuid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);
const { DateTime } = require('luxon');
const ClassSgMail = require('../config/sgMail.config');

const User = db.user;
const BookingGrid = db.bookingGrid;

const router = express.Router();

router.post(
  '/signup',
  [userExist],
  (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    // create a new user
    const OTP = v4();
    User.create({
      email,
      password: OTP,
      passwordExpiry: DateTime.now().plus({ minutes: 1 }),
    })
      .then(() => {
        //send link
        const mySgMail = new ClassSgMail(email, OTP);
        mySgMail.sendMessage(res);
      })
      .catch((e: any) => {
        res.status(500).send(e.message);
      });
  }
);

router.post(
  '/signup',
  [userExist],
  (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    // create a new user
    const OTP = v4();
    User.create({
      email,
      password: OTP,
      passwordExpiry: DateTime.now().plus({ minutes: 1 }),
    })
      .then(() => {
        //send link
        const mySgMail = new ClassSgMail(email, OTP);
        mySgMail.sendMessage(res);
      })
      .catch((e) => {
        res.status(500).send(e.message);
      });
  }
);

router.get('/signup', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.post(
  '/createbooking',
  [checkForBookingAlreadyExisting],
  (req: express.Request, res: express.Response) => {
    try {
      const { start, end } = req.body;
      // create a new user
      const OTP = v4();
      BookingGrid.create({
        start,
        end,
      })
        .then((booking: any) => {
          //send link
          res.status(200).send(booking);
        })
        .catch((e: any) => {
          res.status(500).send(e.message);
        });
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

router.post(
  '/retrieveAvailability',
  [getAvailability],
  (req: express.Request, res: express.Response) => {
    try {
      //@ts-expect-error
      res.status(200).send(res.availabilities);
    } catch (e) {
      res.send('sua');
    }
  }
);

router.get(
  '/',
  [checkForOtp],
  (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
);

module.exports = router;
