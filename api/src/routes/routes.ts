import express, { NextFunction, Request, Response } from 'express';

import { changePwdEmail, sendEmail } from '../config/sendGrid/config';
import GoogleCalendarService, {
  deleteEvent,
  getEvents,
} from '../googleApi/GoogleCalendarService';
import authService from '../services/AuthService';
import bookingService from '../services/BookingService';
import { ErrorService } from '../services/ErrorService';
import userService from '../services/UserService';
import {
  ResponseWithAvalType,
  ResponseWithUserType,
} from './interfaces/interfaces';

const db = require('../database/models/db');
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

const User = db.user;
const Bookings = db.Bookings;
const DatabaseAvailabilty = db.DatabaseAvailabilty;
const FixedBookings = db.FixedBookings;
const stripe = require('stripe')(
  'sk_test_51K5AW1G4kWNoryvxAZVOFwVPZ6qyVKUqZJslh0UYiNlU0aDb3hd0ksS0zCBWbyXUvDKB6f9CA9RvU3Gwc2rfBtsw00lC98E85E'
);
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        const googleUser = await googleAuth(token);
        if (!googleUser) {
          ErrorService.badRequest('Something went wrong in google login');
        } else {
          const user = await userService.findOne(googleUser.email);
          if (user) {
            res.status(200).send({ user: user, isGoogleLogin: true });
          } else {
            const { email, name } = googleUser;
            await userService.create({
              email,
              name,
            });
          }
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
      console.log('start fn');
      const { start, end } = req.body;
      const userEmail = res.user?.email || '';

      // create booking
      const booking = await bookingService.create(req);

      console.log(booking);
      console.log(userEmail, 'userEmail');

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
  async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
    const { start, end } = req.body;
    try {
      const bks = await bookingService.findOne(req);
      if (bks) {
        await bks.destroy();
        // find the corresponding event on google calendar
        const events = await getEvents(start, end);
        // if the event exists, delete it
        if (events.length > 0) {
          await deleteEvent(events[0].id).catch((err) => {
            console.log(err);
          });
        }
        res.status(200).send('Booking deleted');
      } else {
        throw ErrorService.badRequest('Booking not found');
      }
    } catch (e: any) {
      next(e);
    }
  }
);

router.get(
  '/userBookings',
  [authenticateToken],
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-expect-error
    const userEmail = res.user.email;
    try {
      const usr = await userService.findOne(userEmail);
      if (usr) {
        const bks = await Bookings.findAll({
          where: { userId: usr.id },
        });
        res.status(200).send(bks);
      } else {
        res.status(200).send([]);
      }
    } catch (e: any) {
      next(e);
    }
  }
);

router.get(
  '/usersAndBookings',
  [authenticateToken],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bks = await bookingService.findAll(
        {
          include: {
            model: User,
            as: 'user',
          },
          order: [['start', 'DESC']],
        },
        true
      );
      res.send(bks);
    } catch (e: any) {
      next(e);
    }
  }
);

router.get(
  '/allUsers',
  [authenticateToken],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usr = await userService.findAll();
      res.send(usr);
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/resetPassword',
  async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.body.email;
    try {
      const usr = User.findOne({ where: { email: userEmail } });
      if (usr) {
        const updateUser = async () => {
          usr.set({ resetPasswordToken: OTP });
          await usr.save();
        };
        updateUser();
        const EMAIL = changePwdEmail(userEmail, OTP);
        try {
          await sendEmail(EMAIL);
          res.send('Check your email!');
        } catch (error) {
          throw ErrorService.badRequest('Email not found');
        }
      } else {
        throw ErrorService.badRequest('User not found');
      }
    } catch (e: any) {
      next(e);
    }
  }
);
router.post(
  '/password/otp',
  async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordToken = req.body.resetPasswordToken;
    try {
      const usr = User.findOne({ where: { resetPasswordToken } });
      if (usr) {
        res.send('allowed to reset password');
      } else {
        throw ErrorService.badRequest('User not found');
      }
    } catch (e: any) {
      next(e);
    }
  }
);

router.put(
  '/defaultAvailabilities',
  async (req: Request, res: Response, next: NextFunction) => {
    const { workSettings } = req.body;
    console.log(req.body, 'req.body');
    try {
      workSettings.forEach(async (daySetting: any) => {
        await DatabaseAvailabilty.update(
          {
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
          },
          {
            where: { day: daySetting.day },
          }
        );
      });
      res.send({ message: 'availabilities created!' });
    } catch (e: any) {
      next(e);
    }
  }
);

router.get(
  '/defaultAvailabilities',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const worksHours = await DatabaseAvailabilty.findAll();
      res.send(worksHours);
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/password/newPassword',
  async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordToken = req.body.resetPasswordToken;
    const newPassword = req.body.newPassword;
    try {
      const usr = await User.findOne({ where: { resetPasswordToken } });
      if (usr) {
        usr.set({ password: newPassword });
        await usr.save();
        res.send('password changed');
      } else {
        throw ErrorService.badRequest('User doesnt exists');
      }
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/manageHolidays',
  // [authenticateToken, bookExist, bookOutRange],
  [authenticateToken, bookExist],

  async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
    try {
      const { start, end } = req.body;
      const userEmail = res.user?.email;

      // create a new user
      const booking = await Bookings.create({
        start,
        end,
      });

      // search the user by email
      const usr = await User.findOne({ where: { email: userEmail } });

      // associate the booking with the user
      booking.setUser(usr).catch((e: any) => {
        next(e);
      });

      res.status(200).send(booking);
    } catch (e: any) {
      next(e);
    }
  }
);

router.get(
  '/getHolidays',
  [authenticateToken],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bks = await Bookings.findAll({ where: { isHoliday: true } });
      res.send(bks);
    } catch (e: any) {
      next(e);
    }
  }
);

router.get(
  '/fixedBookings',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await FixedBookings.findAll();
      res.send(data);
    } catch (e: any) {
      next(e);
    }
  }
);

router.post(
  '/fixedBookings',
  async (req: Request, res: Response, next: NextFunction) => {
    const { fixedBks } = req.body;
    const errors: any = [];
    try {
      console.log(FixedBookings, 'FIXED BOOKING MODEL');

      const asyncFn = async () => {
        for (const fixedBook of fixedBks) {
          console.log(fixedBook, 'fixedBook');
          for (const book of fixedBook.bookings) {
            await FixedBookings.create({
              day: fixedBook.day,
              start: book.start,
              end: book.end,
              localId: book.id,
              email: book.email,
            }).catch((e: any) => {
              errors.push(e);
              return;
            });
          }
        }
      };
      asyncFn();
      if (errors.length > 0) {
        next(errors[0]);
      }
      res.send({ message: 'fixedBookings created!' });
    } catch (e: any) {
      next(e);
    }
  }
);

router.put('/fixedBookings', async (req: Request, res: Response) => {
  const { fixedBks } = req.body;
  try {
    const errors: any = [];
    const mainAsyncFn = () => {
      console.log(FixedBookings, 'FIXED BOOKING MODEL');
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

router.post(
  '/create-payment-intent',
  async (req: Request, res: Response, next: NextFunction) => {
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
      next(e);
    }
  }
);

// Create a PaymentIntent with the order amount and currency

export default router;
