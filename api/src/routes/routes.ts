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

const User = db.user;
const Bookings = db.Bookings;

const router = express.Router();

const URL = 'http://localhost:3000/resetPassword';

const OTP = v4();

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
      const adminOrUser =
        email === 'galliziafilippo@gmail.com' ? 'admin' : 'user';
      try {
        User.create({
          email,
          name,
          password,
          phoneNumber,
          role: adminOrUser,
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
        //@ts-expect-error
        res.status(200).send({ user: res.user, token: res.locals.jwt_secret });
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

          const parsedData = DateTime.fromISO(booking.start).toFormat(
            'yyyy LLL dd - t'
          );

          const msg = {
            to: [userEmail, process.env.EMAIL],
            from: process.env.EMAIL, // Use the email address or domain you verified above
            subject: 'teo-time',
            text: 'and easy to do anywhere, even with Node.js',
            html: `
            <div style="padding: 10px; border: 3px dashed #f59e0b; font-size: 1.1rem;">
            <h2>
              Ciao! Il tuo appuntamento e' stato registrato con successo.
            </h2>
            <p style="margin-bottom: 10px;">
              Questi sono i dettagli:
            </p>
            <p>
              EVENTO: <span style="font-weight: bold;">Trattamento osteopatico</span>
            </p>
            <p>
              DATA:
              <span style="font-weight: bold;">
                ${parsedData}</span
              >
            </p>
          </div>
          `,
          };
          const sendEmail = async () => {
            await sgMail
              .sendMultiple(msg)
              .then(
                () => {
                  res.status(200).send(booking);
                },
                (e: any) => {
                  res.status(500).send({
                    success: false,
                    error: {
                      message: e,
                    },
                  });
                }
              )
              .catch((e: any) => {
                res.status(500).send({
                  success: false,
                  error: {
                    message: e,
                  },
                });
              });
          };
          sendEmail();
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
);

router.post(
  '/retrieveAvailability',
  [getAvailability],
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

router.get(
  '/bookingFromUser',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    //@ts-expect-error
    const userEmail = res.user.email;
    try {
      const user = User.findOne({ where: { email: userEmail } }).catch(
        (e: any) => {
          throw e;
        }
      );
      user.then((u: any) => {
        if (u) {
          Bookings.findAll({ where: { userId: u.id } })
            .then((bks: any) => {
              res.status(200).send(bks);
            })
            .catch((e: any) => {
              throw e;
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

router.post(
  '/resetPassword',
  async (req: express.Request, res: express.Response) => {
    const userEmail = req.body.email;
    try {
      User.findOne({ where: { email: userEmail } })
        .then((usr: any) => {
          if (usr) {
            const updateUser = async () => {
              usr.set({ resetPasswordToken: OTP });
              await usr.save();
            };
            updateUser();
            const msg = {
              to: userEmail,
              from: process.env.EMAIL, // Use the email address or domain you verified above
              subject: 'teo-time',
              text: 'and easy to do anywhere, even with Node.js',
              html: `<a href=${URL}?resetPasswordToken=${OTP}>reset your password here</a>`,
            };
            const sendEmail = async () => {
              await sgMail
                .send(msg)
                .then(
                  () => {
                    res.send({ message: 'succesfull sent' });
                  },
                  (e: any) => {
                    throw e;
                  }
                )
                .catch((e: any) => {
                  throw e;
                });
            };
            sendEmail();
          } else {
            res.status(400).send({
              success: false,
              error: {
                message: "l' email non esiste",
              },
            });
          }
        })
        .catch((e: any) => {
          console.log(e, 'here', 'e');
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
  '/password/otp',
  async (req: express.Request, res: express.Response) => {
    const resetPasswordToken = req.body.resetPasswordToken;
    try {
      User.findOne({ where: { resetPasswordToken } })
        .then((usr: any) => {
          if (usr) {
            res.send('allowed to reset password');
          } else {
            res.status(400).send({
              success: false,
              error: {
                message: 'not allowed',
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
  '/password/newPassword',
  async (req: express.Request, res: express.Response) => {
    const resetPasswordToken = req.body.resetPasswordToken;
    const newPassword = req.body.newPassword;
    try {
      User.findOne({ where: { resetPasswordToken } })
        .then((usr: any) => {
          if (usr) {
            const asyncFn = async () => {
              usr.set({ password: newPassword });
              await usr.save();
              res.send('password changed');
            };
            asyncFn();
          } else {
            res.status(400).send({
              success: false,
              error: {
                message: 'not allowed',
              },
            });
          }
        })
        .catch((e: any) => {
          console.log(e, 'e');
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
