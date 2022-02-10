import express, { NextFunction, Request, Response, Router } from 'express';

import GoogleCalendarService, {
  deleteEvent,
  getEvents,
} from '../../googleApi/GoogleCalendarService';
import bookingService from '../../services/BookingService/BookingService';
import { ErrorService } from '../../services/ErrorService';
import userService from '../../services/UserService';
import { ResponseWithUserType } from '../interfaces/interfaces';

const { authenticateToken, bookExist } = require('../../middleware/middleware');
const db = require('../../database/models/db');

const User = db.user;

const BookingRouter = express.Router();

export default (app: Router) => {
  app.use('/bookings', BookingRouter);

  BookingRouter.post(
    '/',
    [authenticateToken, bookExist],
    async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
      try {
        const { start, end } = req.body;
        if (!res.user) {
          next(
            ErrorService.badRequest(
              'Use is missing, you are not loggein in probably'
            )
          );
        } else {
          const userEmail = res.user.email;
          const usr = await userService.findOne(userEmail);
          if (!usr) {
            next(ErrorService.badRequest('User already exist'));
          }

          // create booking
          const booking = await bookingService.create(req);

          // associate the booking with the user
          await booking.setUser(usr);

          // insert the booking to admin google calendar
          const googleCalendarService = new GoogleCalendarService(
            userEmail as string,
            start,
            end
          );
          // INSERT  CALENDAR EVENTS
          //await googleCalendarService.insertEvent();

          // send email to client and admin
          //await EmailService.sendEmail(
          //  userEmail,
          //  DateTime.fromISO(booking.start).toFormat('yyyy LLL dd t')
          //);

          // send booking to client
          res.status(200).send(booking);
        }
      } catch (e: any) {
        console.log(e);
        next(e);
      }
    }
  );
  BookingRouter.get(
    '/',
    async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
      res.send('ciao');
    }
  );

  BookingRouter.delete(
    '/',
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

  BookingRouter.get(
    '/users',
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
};
