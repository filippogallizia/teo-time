import express, { NextFunction, Request, Response, Router } from 'express';

import db from '../../database/models/db';
import { authenticateToken, bookExist } from '../../middleware/middleware';
import { ResponseWithUserType } from '../interfaces/interfaces';

const HolidayRouter = express.Router();

const Bookings = db.Bookings;
const User = db.user;

export default (app: Router) => {
  app.use('/holidays', HolidayRouter);

  {
    /*TODO -> move away business login from endpoint
     and change call to database to call to services.         
     */
  }

  HolidayRouter.post(
    '/',
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

  HolidayRouter.get(
    '/',
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
};
