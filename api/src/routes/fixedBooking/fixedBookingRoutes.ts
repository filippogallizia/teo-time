import express, { NextFunction, Request, Response, Router } from 'express';

import { ErrorService } from '../../services/errorService/ErrorService';
import FixedBookingService from '../../services/fixedBookingService/FixedBookingService';
import { RequestWithFixedBkg } from '../../services/fixedBookingService/interfaces';

//const db = require('../../database/models/db');

const { authenticateToken } = require('../../middleware/middleware');

const FixedBookingRouter = express.Router();

//const FixedBookings = db.FixedBookings;

export default (app: Router) => {
  app.use('/fixedBookings', FixedBookingRouter);

  FixedBookingRouter.get(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await FixedBookingService.findAll();
        res.send(data);
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
        await FixedBookingService.create(req);
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
        const booking = await FixedBookingService.destroy(req);
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
        const isUpdated = await FixedBookingService.update(req);
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
