/* eslint-disable prefer-const */
import { Request } from 'express';

import db from '../../database/models/db';
import { DatabaseAvailabilityType } from '../../types/types';
import { ErrorService } from '../errorService/ErrorService';
import { createAvalAlgoritm } from './createAvalAlgoritm/createAvalAlgoritm';

const DatabaseAvailabilty = db.DatabaseAvailabilty;

class AvailabilitiesService {
  availabilityModel = DatabaseAvailabilty;

  public async update(req: Request): Promise<DatabaseAvailabilityType[]> {
    try {
      let {
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

      if (workTimeStart >= workTimeEnd) {
        throw ErrorService.badRequest(
          "Ora di inizio non puo' essere superiore ad ora di fine"
        );
      }

      if (breakTimeStart >= breakTimeEnd) {
        throw ErrorService.badRequest(
          "Ora di inizio pausa non puo' essere superiore ad ora di fine pausa"
        );
      }

      return await DatabaseAvailabilty.update(
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
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }

  public async findAll(): Promise<DatabaseAvailabilityType[]> {
    try {
      return await this.availabilityModel.findAll();
    } catch (e) {
      throw ErrorService.internal(e);
    }
  }
}

export const createDynamicAvail = (daySetting: DatabaseAvailabilityType[]) => {
  const result = daySetting.map((day: DatabaseAvailabilityType) => {
    return {
      day: day.day,
      availability: createAvalAlgoritm(
        { start: day.workTimeStart, end: day.workTimeEnd },
        { start: day.breakTimeStart, end: day.breakTimeEnd },
        {
          hours: Number(day.eventDurationHours),
          minutes: Number(day.eventDurationMinutes),
        },
        {
          hours: Number(day.breakTimeBtwEventsHours),
          minutes: Number(day.breakTimeBtwEventsMinutes),
        }
      ),
    };
  });
  return result;
};

export const setDefaultAvalInDatabase = (
  availDefault: DatabaseAvailabilityType[]
) => {
  availDefault.map(async (day: DatabaseAvailabilityType) => {
    const {
      workTimeStart,
      workTimeEnd,
      breakTimeStart,
      breakTimeEnd,
      eventDurationHours,
      eventDurationMinutes,
      breakTimeBtwEventsHours,
      breakTimeBtwEventsMinutes,
    } = day;

    const createAv = async () => {
      await DatabaseAvailabilty.create({
        day: day.day,
        workTimeStart,
        workTimeEnd,
        breakTimeStart,
        breakTimeEnd,
        eventDurationHours,
        eventDurationMinutes,
        breakTimeBtwEventsHours,
        breakTimeBtwEventsMinutes,
      });
    };
    await createAv();
  });
};

export const parseDatabaseAvailability = async (
  availDefault: DatabaseAvailabilityType[]
) => {
  return await DatabaseAvailabilty.findAll()
    .then((daySetting: DatabaseAvailabilityType[]) => {
      if (daySetting.length > 0) {
        return createDynamicAvail(daySetting);
      } else {
        setDefaultAvalInDatabase(availDefault);
      }
    })
    .catch((e: any) => {
      throw ErrorService.internal(e);
    });
};

export default new AvailabilitiesService();
