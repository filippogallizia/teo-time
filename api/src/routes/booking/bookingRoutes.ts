import express, { NextFunction, Request, Response, Router } from 'express';
import { DateTime } from 'luxon';

import GoogleCalendarService, {
  deleteEvent,
  getEvents,
} from '../../googleApi/GoogleCalendarService';
import bookingService from '../../services/bookingService/BookingService';
import EmailService from '../../services/emailService/EmailService';
import { ErrorService } from '../../services/errorService/ErrorService';
import userService from '../../services/userService/UserService';
import { ResponseWithUserType } from '../interfaces/interfaces';
import { filterBookings } from './middleware/bookingMiddleware';

const { authenticateToken, bookExist } = require('../../middleware/middleware');
const BookingRouter = express.Router();

export default (app: Router) => {
  app.use('/bookings', BookingRouter);

  BookingRouter.post(
    '/',
    [authenticateToken, bookExist],
    async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
      const { start, end, isHoliday } = req.body;

      try {
        if (!res.user) {
          next(
            ErrorService.badRequest(
              'User is missing, you are not loggein in probably'
            )
          );
        } else {
          const userEmail = res.user.email;
          const usr = await userService.findOne(userEmail);
          if (!usr) {
            next(ErrorService.badRequest('User already exist'));
          }

          // insert the booking to admin google calendar
          const googleCalendarService = new GoogleCalendarService({
            userEmail: userEmail as string,
            start,
            end,
          });

          // INSERT  CALENDAR EVENTS
          const calendarEventId = await googleCalendarService.insertEvent();

          // create booking
          const booking = await bookingService
            .create({
              start,
              end,
              isHoliday,
              calendarEventId,
            })
            .catch(async (e) => {
              calendarEventId && (await deleteEvent(calendarEventId));
              next(e);
            });

          // associate the booking with the user
          await booking.setUser(usr);

          // send email to client and admin
          const emailBody = EmailService.getConfirmationEmailBody(
            userEmail,
            DateTime.utc(booking.start).toFormat('yyyy LLL dd t').toString()
          );
          await EmailService.sendEmail(emailBody);

          // send booking to client
          res.status(200).send(booking);
        }
      } catch (e: any) {
        //TODO => probably if there is an error in creation I need to delete event from google calendar
        console.log(e);
        next(e);
      }
    }
  );

  BookingRouter.delete(
    '/',
    [authenticateToken],
    async (req: Request, res: ResponseWithUserType, next: NextFunction) => {
      const { start } = req.body;
      try {
        if (!res.user) {
          next(
            ErrorService.badRequest(
              'Use is missing, you are not loggein in probably'
            )
          );
        } else {
          const userEmail = res.user.email;
          const bks = await bookingService.findOne(req);
          if (bks) {
            await bks.destroy();

            // delete corresponding event on google calendar
            bks.calendarEventId && (await deleteEvent(bks.calendarEventId));

            const emailBody = EmailService.getDeleteEmailBody(
              userEmail,
              DateTime.fromISO(start).toFormat('yyyy LLL dd t').toString()
            );

            await EmailService.sendEmail(emailBody);
            res.status(200).send('Booking deleted');
          } else {
            throw ErrorService.badRequest('Booking not found');
          }
        }
      } catch (e: any) {
        next(e);
      }
    }
  );

  BookingRouter.get(
    '/users',
    [authenticateToken, filterBookings],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        //@ts-expect-error
        const bks = res.bks;
        res.send(bks);
      } catch (e: any) {
        next(e);
      }
    }
  );
};
