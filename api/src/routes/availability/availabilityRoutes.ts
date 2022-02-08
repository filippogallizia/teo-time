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

  //TODO -> change it to a get request by passing the body in the query parameter.
  AvailabilityRouter.post(
    '/retrieveAvailability',
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
      const { workSettings } = req.body;
      try {
        workSettings.forEach(async (daySetting: any) => {
          await DatabaseAvailabilty.update(
            {
              day: daySetting.day,
              workTimeStart: daySetting.parameters.workTimeRange.start,
              workTimeEnd: daySetting.parameters.workTimeRange.end,
              breakTimeStart: daySetting.parameters.breakTimeRange.start,
              breakTimeEnd: daySetting.parameters.breakTimeRange.end,
              eventDurationHours: daySetting.parameters.eventDuration.hours,
              eventDurationMinutes: daySetting.parameters.eventDuration.minutes,
              breakTimeBtwEventsHours:
                daySetting.parameters.breakTimeBtwEvents.hours,
              breakTimeBtwEventsMinutes:
                daySetting.parameters.breakTimeBtwEvents.minutes,
            },
            {
              where: { day: daySetting.day },
            }
          );
        });
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
