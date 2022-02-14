import { DatabaseAvailabilityType } from '../../types/types';
import { ErrorService } from '../errorService/ErrorService';
import { createAvalAlgoritm } from './createAvalAlgoritm/createAvalAlgoritm';
const db = require('../../database/models/db');
const DatabaseAvailabilty = db.DatabaseAvailabilty;

//export default AvailabilitiesService;

const parseDatabaseAvailability = async (
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
        availDefault.map((day: DatabaseAvailabilityType) => {
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
          DatabaseAvailabilty.create({
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
            throw ErrorService.internal(e);
          });
        });
      }
    })
    .catch((e: any) => {
      throw ErrorService.internal(e);
    });
};

export default parseDatabaseAvailability;
