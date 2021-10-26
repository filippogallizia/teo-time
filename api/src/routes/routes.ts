import express from 'express';
import { Op } from 'sequelize';
import { checkForBookingOutOfRange } from '../middleware/middleware';

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

const passworExp = DateTime.now().plus({ minutes: 10 });

router.post(
  '/signup',
  [userExist],
  (req: express.Request, res: express.Response) => {
    const { email, phoneNumber, name } = req.body;
    // create a new user
    const OTP = v4();
    User.create({
      email,
      password: OTP,
      passwordExpiry: passworExp,
      name,
      phoneNumber,
    })
      .then((usr: any) => {
        const msg = {
          to: email,
          from: process.env.EMAIL, // Use the email address or domain you verified above
          subject: 'teo-time',
          text: `email: ${usr.email}  name: ${usr.name} `,
          html: `<div><a href=http://localhost:3000/homepage/success?otp=${OTP}>LOG IN HERE</a></div>`,
        };
        //send link
        // const mySgMail = new ClassSgMail(
        //   email,
        //   `<a href=http://localhost:3000/homepage/success?otp=${OTP}>LOG IN HERE</a>`
        // );
        // mySgMail.sendMessage(res);
        const sendMessage = async () => {
          try {
            await sgMail.send(msg);
            res.status(200).send({ message: 'succesfull sent' });
          } catch (e: any) {
            res.status(500).send({ message: e.message });
          }
        };
        sendMessage();
      })
      .catch((e: any) => {
        res.status(500).send({ message: e.message });
      });
  }
);

router.post(
  '/createbooking',
  [checkForBookingAlreadyExisting, checkForBookingOutOfRange],
  (req: express.Request, res: express.Response) => {
    try {
      const { start, end, email } = req.body;
      // create a new user
      const OTP = v4();
      BookingGrid.create({
        start,
        end,
      })
        .then((booking: any) => {
          User.findOne({ where: { email } })
            .then((usr: any) => {
              booking.setUser(usr).catch((e: any) => {
                throw e;
              });
            })
            .catch((e: any) => {
              throw e;
            });
          //send link
          res.status(200).send(booking);
        })
        .catch((e: any) => {
          throw e;
        });
    } catch (e: any) {
      res.status(500).send({ message: e.message });
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
      res.status(500).send({ message: e.message });
    }
  }
);

router.post(
  '/delete',
  [getAvailability],
  (req: express.Request, res: express.Response) => {
    try {
      //@ts-expect-error
      res.status(200).send(res.availabilities);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }
);

router.get(
  '/',
  [checkForOtp],
  (req: express.Request, res: express.Response) => {
    try {
      res.status(200).send('welcome');
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }
);

router.post(
  '/bookingFromUser',
  // [checkForOtp],
  (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    let findedBooking = 'undefined';
    try {
      User.findOne({ where: { email } }).then((usr: any) => {
        BookingGrid.findOne({ where: { id: usr.id } })
          .then((bks: any) => {
            // findedBooking = bks;
            res.status(200).send(bks);
          })
          .catch((e: any) => {
            throw e;
          });
      });
      // res.status(200).send(findedBooking);
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }
);

module.exports = router;
