import express, { NextFunction, Request, Response, Router } from 'express';

import userService from '../../services/userService/UserService';

const db = require('../../database/models/db');

const Bookings = db.Bookings;

const { authenticateToken } = require('../../middleware/middleware');

const UserRouter = express.Router();

export default (app: Router) => {
  app.use('/users', UserRouter);

  UserRouter.get(
    '/',
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

  UserRouter.get(
    '/bookings',
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
};
