import express, { NextFunction, Request, Response, Router } from 'express';

import { ResponseWithAvalType } from '../interfaces/interfaces';

const db = require('../../database/models/db');

const DatabaseAvailabilty = db.DatabaseAvailabilty;

const {
  getAvailability,
  authenticateToken,
} = require('../../middleware/middleware');

const AvailabilityRouter = express.Router();

export default (app: Router) => {
  app.use('/availability', AvailabilityRouter);

  //TODO -> create the service

  AvailabilityRouter.get(
    '/',
    [getAvailability],
    (req: Request, res: ResponseWithAvalType, next: NextFunction) => {
      try {
        res.status(200).send(res.availabilities);
      } catch (e: any) {
        next(e);
      }
    }
  );

  AvailabilityRouter.put(
    '/default',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        day,
        workTimeStart,
        workTimeEnd,
        breakTimeStart,
        breakTimeEnd,
        eventDurationHours,
        eventDurationMinutes,
        breakTimeBtwEventsHours,
        breakTimeBtwEventsMinutes,
      } = req.body.workSettings;
      try {
        await DatabaseAvailabilty.update(
          {
            day,
            workTimeStart,
            workTimeEnd,
            breakTimeStart,
            breakTimeEnd,
            eventDurationHours,
            eventDurationMinutes,
            breakTimeBtwEventsHours,
            breakTimeBtwEventsMinutes,
          },
          {
            where: { day },
          }
        );

        res.send({ message: 'availabilities created!' });
      } catch (e: any) {
        next(e);
      }
    }
  );

  AvailabilityRouter.get(
    '/default',
    [authenticateToken],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const worksHours = await DatabaseAvailabilty.findAll();
        res.send(worksHours);
      } catch (e: any) {
        next(e);
      }
    }
  );
};
