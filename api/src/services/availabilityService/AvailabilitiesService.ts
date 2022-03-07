import { Request } from 'express';

import { DatabaseAvailabilityType } from '../../types/types';
import { ErrorService } from '../errorService/ErrorService';
import { createAvalAlgoritm } from './createAvalAlgoritm/createAvalAlgoritm';

const db = require('../../database/models/db');
const DatabaseAvailabilty = db.DatabaseAvailabilty;

class AvailabilitiesService {
  availabilityModel = DatabaseAvailabilty;

  public async update(req: Request): Promise<DatabaseAvailabilityType[]> {
    try {
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

export const parseDatabaseAvailability = async (
  availDefault: DatabaseAvailabilityType[]
) => {
  return await DatabaseAvailabilty.findAll()
    .then((daySetting: DatabaseAvailabilityType[]) => {
      if (daySetting.length > 0) {
        const result = daySetting.map((day: DatabaseAvailabilityType) => {
          return {
            day: day.day,
            /**
             * this function create aval slots given the following inputs
             * @param workTimeRange
             * @param breakTimeRange
             * @param eventDuration
             * @param breakTimeBtwEvents
             */
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
      } else {
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
          }).catch((e: any) => {
            console.log(e, 'e');
            throw ErrorService.internal(e);
          });
        });
      }
    })
    .catch((e: any) => {
      throw ErrorService.internal(e);
    });
};

//export default parseDatabaseAvailability;

export default new AvailabilitiesService();
