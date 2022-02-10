import express, { NextFunction, Request, Response, Router } from 'express';

import { ErrorService } from '../../services/ErrorService';

const db = require('../../database/models/db');

const { authenticateToken } = require('../../middleware/middleware');

const FixedBookingRouter = express.Router();

const FixedBookings = db.FixedBookings;

export default (app: Router) => {
  app.use('/fixedBookings', FixedBookingRouter);

  FixedBookingRouter.get(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await FixedBookings.findAll();
        res.send(data);
      } catch (e: any) {
        next(e);
      }
    }
  );

  //TODO -> move away business logic from here
  FixedBookingRouter.post(
    '/',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      const { fixedBks } = req.body;
      try {
        await FixedBookings.create({
          day: fixedBks.day,
          start: fixedBks.start,
          end: fixedBks.end,
          email: fixedBks.email,
        });
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
      const id = req.query.id;
      try {
        /**
         * destroy method returns 0 if it doesnt find the item, otherwise it returns 1
         */
        const booking = await FixedBookings.destroy({ where: { id } });
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
      const { start, end, day, email, id } = req.body.fixedBks;
      try {
        const isUpdated = await FixedBookings.update(
          {
            start,
            end,
            day,
            email,
          },
          {
            where: {
              id,
            },
          }
        );
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
