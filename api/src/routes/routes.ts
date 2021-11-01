import express from 'express';
import { Op } from 'sequelize';
import { BookingType, UserType } from '../../../types/Types';
const _ = require('lodash');

const generalAvaliabilityRules = require('../config/timeConditions.config.json');
const path = require('path');
const {
  getAvailability,
  userExist,
  bookOutRange,
  bookExist,
  createToken,
  authenticateToken,
} = require('../middleware/middleware');
const db = require('../models/db');
const sgMail = require('@sendgrid/mail');
const { v4 } = require('uuid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);
const { DateTime } = require('luxon');
const ClassSgMail = require('../config/sgMail.config');

const User = db.user;
const Bookings = db.Bookings;

const router = express.Router();

router.post(
  '/signup',
  [userExist],
  (req: express.Request, res: express.Response) => {
    //@ts-expect-error
    if (res.user) {
      res.status(500).send({
        success: false,
        error: {
          message: 'user already Exist',
        },
      });
    } else {
      const { email, phoneNumber, name, password } = req.body;
      try {
        User.create({
          email,
          name,
          password,
          phoneNumber,
        })
          .then((user: UserType) => {
            res.send({ message: 'User was registered successfully!' });
          })
          .catch((e: any) => {
            res.status(500).send({
              success: false,
              error: {
                message: e,
              },
            });
          });
      } catch (e: any) {
        res.status(500).send({
          success: false,
          error: {
            message: e,
          },
        });
      }
    }
  }
);
router.post(
  '/login',
  [userExist, createToken],
  (req: express.Request, res: express.Response) => {
    //@ts-expect-error
    if (!res.user) {
      res.status(500).send({
        success: false,
        error: {
          message: "user doesn't exist",
        },
      });
    } else {
      try {
        res.status(200).send(res.locals.jwt_secret);
      } catch (e) {
        res.status(500).send({
          success: false,
          error: {
            message: e,
          },
        });
      }
    }
  }
);

router.post(
  '/createbooking',
  [authenticateToken, bookExist, bookOutRange],
  (req: express.Request, res: express.Response) => {
    try {
      const { start, end } = req.body;
      //@ts-expect-error
      const userEmail = res.user.email;
      // create a new user
      Bookings.create({
        start,
        end,
      })
        .then((booking: BookingType) => {
          // search the user by email
          User.findOne({ where: { email: userEmail } })
            .then((usr: UserType) => {
              // associate the booking with the user
              //@ts-expect-error
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
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    }
  }
);

router.post(
  '/retrieveAvailability',
  [authenticateToken, getAvailability],
  (req: express.Request, res: express.Response) => {
    try {
      //@ts-expect-error
      res.status(200).send(res.availabilities);
    } catch (e: any) {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    }
  }
);

router.post(
  '/deletebooking',
  [authenticateToken, bookOutRange],
  (req: express.Request, res: express.Response) => {
    const { start, end } = req.body;
    //@ts-expect-error
    const userEmail = res.user.email;
    try {
      Bookings.findOne({ where: { start, end } })
        .then((bks: any) => {
          if (bks) {
            console.log(bks, 'filofilofilo');
            bks
              .destroy()
              .then(() => {
                res.status(200).send('prenotazione cancellata');
              })
              .catch((e: any) => {
                throw e;
              });
          } else {
            res.status(400).send({
              success: false,
              error: {
                message: 'booking not found',
              },
            });
          }
        })
        .catch((e: any) => {
          throw e;
        });
    } catch (e: any) {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    }
  }
);

router.post(
  '/bookingFromUser',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    //@ts-expect-error
    const userEmail = res.user.email;

    let findedBooking = 'undefined';
    try {
      const user = User.findOne({ where: { email: userEmail } }).catch(
        (e: any) => {
          throw e;
        }
      );
      user.then((u: any) => {
        if (u) {
          Bookings.findAll({ where: { userId: u.id } }).then((bks: any) => {
            findedBooking = bks;
            console.log(bks, 'filooooooo');
            res.status(200).send(bks);
          });
        } else {
          res.status(200).send('not booking found');
        }
      });
    } catch (e: any) {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    }
  }
);

router.get(
  '/usersAndBookings',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    try {
      Bookings.findAll({
        include: {
          model: User,
          as: 'user',
        },
        order: [['start', 'ASC']],
      })
        .then((bks: any) => {
          if (bks.length > 0) {
            res.send(bks);
          } else {
            res.status(500).send({
              success: false,
              error: {
                message: 'there are no users',
              },
            });
          }
        })
        .catch((e: any) => {
          throw e;
        });
    } catch (e: any) {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    }
  }
);

module.exports = router;
