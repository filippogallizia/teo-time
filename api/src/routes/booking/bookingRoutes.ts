import express, { NextFunction, Request, Response, Router } from 'express';

import GoogleCalendarService, {
  deleteEvent,
} from '../../googleApi/GoogleCalendarService';
import { parseDateToBeUserFriendly } from '../../helpers/helpers';
import { authenticateToken, bookExist } from '../../middleware/middleware';
import bookingService from '../../services/bookingService/BookingService';
import EmailService from '../../services/emailService/EmailService';
import { ErrorService } from '../../services/errorService/ErrorService';
import userService from '../../services/userService/UserService';
import { ResponseWithUserType } from '../interfaces/interfaces';
import {
  filterBookings,
  sendTelegramNotification,
} from './middleware/bookingMiddleware';

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
              'User is missing, you are not logged in in probably'
            )
          );
        } else {
          const userEmail = res.user.email;
          const usr = await userService.findOne(userEmail);

          if (!usr) {
            next(ErrorService.badRequest('User do not exist'));
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

          // here I need to parse it to JSdate and then to Datetime date ( otherwise dont work dont know why )

          const bookingStartTimeFriendly = parseDateToBeUserFriendly(
            booking.start
          );

          // send email to client and admin
          const emailBody = EmailService.getConfirmationEmailBody(
            userEmail,
            bookingStartTimeFriendly
          );
          await EmailService.sendEmail(emailBody);

          const telegramMessage = `Prenotato nuovo appuntamento il: ${bookingStartTimeFriendly}`;

          sendTelegramNotification(telegramMessage);

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

            const bookingStartTimeFriendly = parseDateToBeUserFriendly(start);

            const emailBody = EmailService.getDeleteEmailBody(
              userEmail,
              bookingStartTimeFriendly
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
