import express, { NextFunction, Request, Response, Router } from 'express';

import { ErrorService } from '../../services/errorService/ErrorService';
import fixedBookingService from '../../services/fixedBookingService/FixedBookingService';

//const db = require('../../database/models/db');

const { authenticateToken } = require('../../middleware/middleware');

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
      try {
        await fixedBookingService.create(req);
        res.send({ message: 'fixedBookings created!' });
      } catch (e: any) {
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

  //TODO -> move away business logic from here
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
