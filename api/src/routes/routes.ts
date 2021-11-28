import express from 'express';
import { Op } from 'sequelize';

import { DATE_TO_CLIENT_FORMAT } from '../../utils';
import { deleteEvent, getEvents, insertEvent } from '../googleApi/calendarApi';
import { changePwdEmail, sendEmail, successBkgEmail } from '../sendGrid/config';
import { UserType } from '../types/types';

const {
  getAvailability,
  userExist,
  bookExist,
  createToken,
  authenticateToken,
  googleAuth,
} = require('../middleware/middleware');
const db = require('../models/db');
const sgMail = require('@sendgrid/mail');
const { v4 } = require('uuid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);
const { DateTime } = require('luxon');

const User = db.user;
const Bookings = db.Bookings;
const WeekavalSettings = db.WeekavalSettings;

const router = express.Router();

const URL = 'http://localhost:3000/resetPassword';

const OTP = v4();

router.post(
  '/signup',
  [userExist],
  (req: express.Request, res: express.Response) => {
    //@ts-expect-error
    if (res.user) {
      return res.status(500).send({
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
          .then(() => {
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
      return res.status(500).send({
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

router.get('/google-login', (req: express.Request, res: express.Response) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        googleAuth(token).then((r: any) => {
          if (!r) {
            res.status(500).send({
              success: false,
              error: {
                message: 'something went wrong',
              },
            });
          } else {
            const asyncFn = async () => {
              const user = await User.findOne({
                where: { email: r.email },
              }).catch((e: any) => {
                res.status(500).send({
                  success: false,
                  error: {
                    message: e,
                  },
                });
              });
              if (user) {
                res.status(200).send({ user: user, isGoogleLogin: true });
              } else {
                const { email, name } = r;
                const adminOrUser =
                  email === 'galliziafilippo@gmail.com' ? 'admin' : 'user';
                try {
                  User.create({
                    email,
                    name,
                    role: adminOrUser,
                  })
                    .then((usr: any) => {
                      res.status(200).send({ user: usr, isGoogleLogin: true });
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
            };
            asyncFn();
          }
        });
      } catch (e) {
        res.status(500).send({
          success: false,
          error: {
            message: e,
          },
        });
      }
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
});

router.post(
  '/createBooking',
  [authenticateToken, bookExist],

  (req: express.Request, res: express.Response) => {
    try {
      const { start, end, isHoliday, localId } = req.body;
      //@ts-expect-error
      const userEmail = res.user.email;
      let userName: string | undefined;
      // create a new user
      Bookings.create({
        start,
        end,
        isHoliday,
        localId,
      })
        .then((booking: any) => {
          // search the user by email
          User.findOne({ where: { email: userEmail } })
            .then((usr: UserType) => {
              userName = usr.name;
              // associate the booking with the user
              booking.setUser(usr).catch((e: any) => {
                res.status(500).send({
                  success: false,
                  error: {
                    message: e,
                  },
                });
              });
            })
            .catch((e: any) => {
              throw e;
            });

          // insert the booking to admin google calendar

          const e = {
            summary: process.env.EVENT_TYPE,
            location: process.env.EVENT_LOCATION,
            description: `${process.env.EVENT_DESCRIPTION} con ${userEmail}`,
            organizer: {
              email: process.env.ADMIN_EMAIL,
              displayName: process.env.ADMIN_NAME,
            },
            start: {
              dateTime: start,
            },
            end: {
              dateTime: end,
            },
            colorId: 1,
          };

          insertEvent(e)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });

          //send email to client and admin

          const email = successBkgEmail(
            userEmail,
            DateTime.fromISO(booking.start).toFormat('yyyy LLL dd t')
          );

          res.status(200).send(booking);
          sendEmail(email)
            .then((r: any) => {
              console.log(r);
            })
            .catch((err: any) => {
              console.log(err);
            });
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
  '/deleteBooking',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    const { start, end } = req.body;
    //@ts-expect-error
    const userEmail = res.user.email;
    try {
      Bookings.findOne({ where: { start, end } })
        .then((bks: any) => {
          if (bks) {
            bks
              .destroy()
              .then(() => {
                // find the corresponding event on google calendar
                getEvents(start, end)
                  .then((res) => {
                    // if the event exists, delete it
                    if (res.length > 0) {
                      deleteEvent(res[0].id)
                        .then((r) => {
                          console.log(r);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                res.status(200).send('prenotazione cancellata');
              })
              .catch((e: any) => {
                throw e;
              });
          } else {
            return res.status(400).send({
              success: false,
              error: {
                message: 'booking not found',
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

router.get(
  '/userBookings',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    //@ts-expect-error
    const userEmail = res.user.email;
    try {
      User.findOne({ where: { email: userEmail } })
        .then((usr: any) => {
          if (usr) {
            Bookings.findAll({
              where: { userId: usr.id },
            })
              .then((bks: any) => {
                res.status(200).send(bks);
              })
              .catch((e: any) => {
                throw e;
              });
          } else {
            res.status(200).send([]);
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
          res.send(bks);
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
  '/allUsers',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    try {
      User.findAll()
        .then((usr: any) => {
          res.send(usr);
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

            const EMAIL = changePwdEmail(userEmail, OTP);
            sendEmail(EMAIL)
              .then(() => {
                res.send('Check your email!');
              })
              .catch(() => {
                return res.status(400).send({
                  success: false,
                  error: {
                    message: "l' email non esiste",
                  },
                });
              });
          } else {
            return res.status(400).send({
              success: false,
              error: {
                message: "l' email non esiste",
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
  '/password/otp',
  async (req: express.Request, res: express.Response) => {
    const resetPasswordToken = req.body.resetPasswordToken;
    try {
      User.findOne({ where: { resetPasswordToken } })
        .then((usr: any) => {
          if (usr) {
            res.send('allowed to reset password');
          } else {
            return res.status(400).send({
              success: false,
              error: {
                message: 'not allowed',
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
  '/manageAvailabilities',
  async (req: express.Request, res: express.Response) => {
    const { workSettings } = req.body;
    try {
      workSettings.forEach((daySetting: any) => {
        WeekavalSettings.findOne({ where: { day: daySetting.day } })
          .then((d: any) => {
            if (d) {
              const asyncFn = async () => {
                d.set({
                  day: daySetting.day,
                  workTimeStart: daySetting.parameters.workTimeRange.start,
                  workTimeEnd: daySetting.parameters.workTimeRange.end,
                  breakTimeStart: daySetting.parameters.breakTimeRange.start,
                  breakTimeEnd: daySetting.parameters.breakTimeRange.end,
                  eventDurationHours: daySetting.parameters.eventDuration.hours,
                  eventDurationMinutes:
                    daySetting.parameters.eventDuration.minutes,
                  breakTimeBtwEventsHours:
                    daySetting.parameters.breakTimeBtwEvents.hours,
                  breakTimeBtwEventsMinutes:
                    daySetting.parameters.breakTimeBtwEvents.minutes,
                });
                await d.save();
              };
              asyncFn();
            } else {
              WeekavalSettings.create({
                day: daySetting.day,
                workTimeStart: daySetting.parameters.workTimeRange.start,
                workTimeEnd: daySetting.parameters.workTimeRange.end,
                breakTimeStart: daySetting.parameters.breakTimeRange.start,
                breakTimeEnd: daySetting.parameters.breakTimeRange.end,
                eventDurationHours: daySetting.parameters.eventDuration.hours,
                eventDurationMinutes:
                  daySetting.parameters.eventDuration.minutes,
                breakTimeBtwEventsHours:
                  daySetting.parameters.breakTimeBtwEvents.hours,
                breakTimeBtwEventsMinutes:
                  daySetting.parameters.breakTimeBtwEvents.minutes,
              })
                .then((data: any) => {
                  console.log(data);
                })
                .catch((e: any) => {
                  return res.status(500).send({
                    success: false,
                    error: {
                      message: e,
                    },
                  });
                });
            }
          })
          .catch((e: any) => {
            return res.status(500).send({
              success: false,
              error: {
                message: e,
              },
            });
          });
      });
      res.send({ message: 'availabilities created!' });
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
  '/workingHours',
  async (req: express.Request, res: express.Response) => {
    try {
      WeekavalSettings.findAll()
        .then((worksHours: any) => {
          res.send(worksHours);
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
            return res.status(400).send({
              success: false,
              error: {
                message: 'not allowed',
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

export const booksExist = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const startRange = req.body.start;
  const endRange = req.body.end;
  try {
    const bookingsAlreadyExist = await Bookings.findAll({
      where: {
        start: {
          [Op.gte]: startRange,
        },
        end: {
          [Op.lte]: endRange,
        },
      },
    });
    if (bookingsAlreadyExist.length > 0) {
      res.status(404).send({
        success: false,
        error: {
          message: 'This hour is already booked',
        },
      });
    } else {
      next();
    }
  } catch (e: any) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
};

router.post(
  '/manageHolidays',
  // [authenticateToken, bookExist, bookOutRange],
  [authenticateToken, booksExist],

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
        .then((booking: any) => {
          // search the user by email
          User.findOne({ where: { email: userEmail } })
            .then((usr: UserType) => {
              // associate the booking with the user
              booking.setUser(usr).catch((e: any) => {
                res.status(500).send({
                  success: false,
                  error: {
                    message: e,
                  },
                });
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
            to: [userEmail, process.env.ADMIN_EMAIL],
            from: process.env.ADMIN_EMAIL, // Use the email address or domain you verified above
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

router.get(
  '/getHolidays',
  [authenticateToken],
  (req: express.Request, res: express.Response) => {
    try {
      Bookings.findAll({ where: { isHoliday: true } })
        .then((bks: any) => {
          res.send(bks);
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
