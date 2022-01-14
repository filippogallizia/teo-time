import { avalSlotsFromTimeRange, retrieveAvailability } from '../../utils';
import { DatabaseAvailabilityType } from '../types/types';
const db = require('../database/models/db');
const DatabaseAvailabilty = db.DatabaseAvailabilty;

class AvailabilitiesService {
  avalSlotsFromTimeRange = avalSlotsFromTimeRange;
  retrieveAvailability = retrieveAvailability;
}

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
            availability: avalSlotsFromTimeRange(
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
            throw e;
          });
        });
      }
    })
    .catch((e: any) => {
      console.log(e);
    });
};

export default parseDatabaseAvailability;
