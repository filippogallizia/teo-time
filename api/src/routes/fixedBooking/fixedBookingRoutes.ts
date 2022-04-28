import express, { NextFunction, Request, Response, Router } from 'express';

import GoogleCalendarService, {
  deleteEvent,
} from '../../googleApi/GoogleCalendarService';
import { authenticateToken } from '../../middleware/middleware';
import { ErrorService } from '../../services/errorService/ErrorService';
import fixedBookingService from '../../services/fixedBookingService/FixedBookingService';
import { FixedBookingDTO } from '../../services/fixedBookingService/interfaces';
import { setTimeToDate } from '../../utils';
import { giveDateToFixBooking } from './helpers/fixedBookingRoutesHelpers';

const FixedBookingRouter = express.Router();

//const FixedBookings = db.FixedBookings;

export default (app: Router) => {
  app.use('/fixedBookings', FixedBookingRouter);

  /**
   * filters: start
   */

  FixedBookingRouter.get(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const bks = await fixedBookingService.findAll();
        console.log(bks, 'bks');
        res.send(bks);
      } catch (e: any) {
        next(e);
      }
    }
  );

  FixedBookingRouter.post(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      const { start, end, day, email, exceptionDate }: FixedBookingDTO =
        req.body.fixedBks;
      const dateFromClient = req.body.dateFromClient;

      try {
        /**
         get the date of the next day with the given Day and assign it given time ( start, end )

         example: given = Monday, get the fullDate of closest Monday from today and assign him given hours
         *  */
        const nextDatewihtGivenDay = giveDateToFixBooking(
          [
            {
              day,
              email,
              end,
              start,
              id: 0,
              exceptionDate,
            },
          ],
          dateFromClient
        );

        const parsedException = setTimeToDate(exceptionDate, start);

        const googleCalendarService = new GoogleCalendarService({
          userEmail: email as string,
          start: nextDatewihtGivenDay[0].start,
          end: nextDatewihtGivenDay[0].end,
          recurrentDay: nextDatewihtGivenDay[0].day,
          exceptionDate: parsedException,
        });

        // insert the booking in admin google calendar
        const calendarEventId = await googleCalendarService
          .insertEvent()
          .catch((e) => {
            console.log(e, 'e');
          });

        await fixedBookingService
          .create({
            start,
            end,
            day,
            email,
            exceptionDate,
            calendarEventId,
          })
          .catch(async (e) => {
            calendarEventId && (await deleteEvent(calendarEventId));
            next(e);
          });

        res.send({ message: 'fixedBookings created!' });
      } catch (e: any) {
        console.log(e, 'e');
        next(e);
      }
    }
  );

  FixedBookingRouter.delete(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        /**
         * destroy method returns 0 if it doesnt find the item, otherwise it returns 1
         */
        const booking = await fixedBookingService.destroy(req);
        // if there is no booking return error
        if (!booking) {
          next(ErrorService.badRequest('Booking not found'));
          return;
        }
        res.send({ message: 'fixedBooking deleted!' });
      } catch (e: any) {
        next(e);
      }
    }
  );

  FixedBookingRouter.put(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        /**
         * update method returns 0 if it doesnt find the item, otherwise it returns 1
         */
        const isUpdated = await fixedBookingService.update(req);
        if (!isUpdated) {
          next(ErrorService.badRequest('Booking not found'));
          return;
        }
        res.send('book updated');
      } catch (e: any) {
        next(e);
      }
    }
  );
};
