import express, { NextFunction, Request, Response, Router } from 'express';

import db from '../../database/models/db';
import {
  authenticateToken,
  getAvailability,
} from '../../middleware/middleware';
import AvailabilitiesService from '../../services/availabilityService/AvailabilitiesService';
import { ResponseWithAvalType } from '../interfaces/interfaces';

const DatabaseAvailabilty = db.DatabaseAvailabilty;

const AvailabilityRouter = express.Router();

export default (app: Router) => {
  app.use('/availability', AvailabilityRouter);

  //TODO -> create the service

  AvailabilityRouter.get(
    '/dynamic',
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
    '/',
    [authenticateToken],
    async (req: Request, res: Response & any, next: NextFunction) => {
      try {
        await AvailabilitiesService.update(req);
        res.send({ message: 'availabilities created!' });
      } catch (e: any) {
        next(e);
      }
    }
  );

  AvailabilityRouter.get(
    '/',
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
