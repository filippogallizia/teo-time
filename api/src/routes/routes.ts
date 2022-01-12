import events from 'events';

import express, { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';

import EmailService from '../database/services/EmailService';
import GoogleCalendarService, {
  deleteEvent,
  getEvents,
} from '../googleApi/GoogleCalendarService';
import { changePwdEmail, sendEmail } from '../sendGrid/config';
import authService from '../services/AuthService';
import bookingService from '../services/BookingService';
import userService from '../services/UserService';
import { TimeRangeType, UserType } from '../types/types';
import {
  ResponseWithAvalType,
  ResponseWithUserType,
} from './interfaces/interfaces';

//const db = require('../database/models/db');
const db = require('../database/models/db');

const stripe = require('stripe')(
  'sk_test_51K5AW1G4kWNoryvxAZVOFwVPZ6qyVKUqZJslh0UYiNlU0aDb3hd0ksS0zCBWbyXUvDKB6f9CA9RvU3Gwc2rfBtsw00lC98E85E'
);

const {
  getAvailability,
  userExist,
  bookExist,
  createToken,
  authenticateToken,
  googleAuth,
} = require('../middleware/middleware');
const sgMail = require('@sendgrid/mail');
const { v4 } = require('uuid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);
const { DateTime } = require('luxon');

const User = db.user;
const Bookings = db.Bookings;
const WeekavalSettings = db.WeekavalSettings;
const FixedBookings = db.FixedBookings;

const router = express.Router();

const OTP = v4();
router.post(
  '/signup',
  [userExist],
  async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
    try {
      await authService.signUp(res.user, req.body);
      res.send({ message: 'User was registered successfully!' });
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/login',
  [userExist, createToken],
  (req: Request, res: ResponseWithUserType, next: NextFunction) => {
    try {
      authService.errorUserNotFound(res.user);
      res.status(200).send({ user: res.user, token: res.locals.jwt_secret });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/google-login',
  (req: Request, res: Response, next: NextFunction) => {
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
                const user = await userService
                  .findOne(r.email)
                  .catch((e: any) => {
                    next(e);
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
                        res
                          .status(200)
                          .send({ user: usr, isGoogleLogin: true });
                      })
                      .catch((e: any) => {
                        next(e);
                      });
                  } catch (e: any) {
                    next(e);
                  }
                }
              };
              asyncFn();
            }
          });
        } catch (e) {
          next(e);
        }
      }
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/createBooking',
  [authenticateToken, bookExist],

  async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
    try {
      const { start, end } = req.body;
      const userEmail = res.user?.email || '';

      // create booking
      const booking = await bookingService.create(req);

      // associate the booking with the user
      const usr = await userService.findOne(userEmail);
      await booking.setUser(usr);

      // insert the booking to admin google calendar
      const googleCalendarService = new GoogleCalendarService(
        userEmail as string,
        start,
        end
      );
      await googleCalendarService.insertEvent();

      // send email to client and admin
      //await EmailService.sendEmail(
      //  userEmail,
      //  DateTime.fromISO(booking.start).toFormat('yyyy LLL dd t')
      //);

      // send booking to client
      res.status(200).send(booking);
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/retrieveAvailability',
  [getAvailability],
  (req: Request, res: ResponseWithAvalType, next: NextFunction) => {
    console.log('here');
    try {
      res.status(200).send(res.availabilities);
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/deleteBooking',
  [authenticateToken],
  (req: Request, res: ResponseWithUserType, next: NextFunction) => {
    const { start, end } = req.body;
    try {
      bookingService
        .findOne(req)
        //Bookings.findOne({ where: { start, end } })
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
                next(e);
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
  (req: Request, res: Response) => {
    //@ts-expect-error
    const userEmail = res.user.email;
    try {
      userService
        .findOne(userEmail)
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
  (req: Request, res: Response) => {
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

router.get('/allUsers', [authenticateToken], (req: Request, res: Response) => {
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
});

router.post('/resetPassword', async (req: Request, res: Response) => {
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
});
router.post('/password/otp', async (req: Request, res: Response) => {
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
});

router.post('/manageAvailabilities', async (req: Request, res: Response) => {
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
              eventDurationMinutes: daySetting.parameters.eventDuration.minutes,
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
});

router.get('/workingHours', async (req: Request, res: Response) => {
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
});

router.post('/password/newPassword', async (req: Request, res: Response) => {
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
});

export const booksExist = async (
  req: Request,
  res: Response,
  next: NextFunction
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

  (req: Request, res: ResponseWithUserType) => {
    try {
      const { start, end } = req.body;
      const userEmail = res.user?.email;
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
  (req: Request, res: Response) => {
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

type FixedBookType = TimeRangeType & { id: number; email: string };

type FixedBksType = {
  day: string;
  bookings: Array<FixedBookType>;
};

router.get('/fixedBookings', async (req: Request, res: Response) => {
  try {
    FixedBookings.findAll()
      .then((data: any) => {
        res.send(data);
      })
      .catch((e: any) => {
        return res.status(500).send({
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
});

router.post('/fixedBookings', async (req: Request, res: Response) => {
  const { fixedBks } = req.body;
  const errors: any = [];
  try {
    const asyncFn = () => {
      for (const fixedBook of fixedBks) {
        //fixedBks.forEach((fixedBook: FixedBksType) => {
        for (const book of fixedBook.bookings) {
          return FixedBookings.create({
            day: fixedBook.day,
            start: book.start,
            end: book.end,
            localId: book.id,
            email: book.email,
          })
            .then((data: any) => {
              console.log(data);
            })
            .catch((e: any) => {
              console.log('aliiii');
              errors.push(e);
              return;
            });
        }
      }
    };
    try {
      await asyncFn();
      if (errors.length > 0) {
        res.status(500).send(errors[0]);
        return;
      }
      res.send({ message: 'fixedBookings created!' });
    } catch (e: any) {
      res.status(500).send({
        success: false,
        error: {
          message: e,
        },
      });
    }
  } catch (e: any) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
});

router.put('/fixedBookings', async (req: Request, res: Response) => {
  const { fixedBks } = req.body;
  try {
    const errors: any = [];
    const mainAsyncFn = () => {
      for (const fixedBook of fixedBks) {
        fixedBook.bookings.forEach((book: any) => {
          FixedBookings.findOne({
            where: { localId: book.id },
          })
            .then((bk: any) => {
              if (bk) {
                const asyncFn = async () => {
                  try {
                    bk.set({
                      ...book,
                      day: fixedBook.day,
                      start: book.start,
                      end: book.end,
                      email: book.email,
                    });
                    await bk.save().catch((e: any) => {
                      errors.push(e);
                    });
                  } catch (e) {
                    errors.push(e);
                  }
                };
                asyncFn();
              } else {
                errors.push('book not found');
              }
            })
            .catch((e: any) => {
              errors.push(e);
            });
        });
      }
    };
    mainAsyncFn();
    if (errors.length > 0) {
      res.status(500).send(errors[0]);
    }
    res.send('book updated');
  } catch (e: any) {
    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
});

const calculateOrderAmount = (ammount: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return ammount * 10;
};

router.post('/create-payment-intent', async (req, res) => {
  const { ammount, email, name } = req.body;
  let id = '';

  try {
    const customerExist = await stripe.customers.list({
      //email: email,
      email: 'filo@filo.com',
    });
    if (customerExist && customerExist.data.length > 0) {
      id = customerExist.data[0].id;
    }

    if (!customerExist || customerExist.data.length === 0) {
      const customer = await stripe.customers.create({
        description: 'My First Test Customer (created for API docs)',
        email: email,
        //source: 'jfdsafjds',
        name: name,
      });
      id = customer.id;
    }
    console.log('here');
    const paymentIntent = await stripe.paymentIntents.create({
      setup_future_usage: 'off_session',
      customer: id,
      amount: calculateOrderAmount(ammount),
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e: any) {
    console.log(e, 'here backedn');

    res.status(500).send({
      success: false,
      error: {
        message: e,
      },
    });
  }
});

// Create a PaymentIntent with the order amount and currency

export default router;
