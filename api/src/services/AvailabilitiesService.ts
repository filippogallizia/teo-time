import { createDynamicAval, retrieveAvailability } from '../../utils';
const db = require('../database/models/db');
const WeekavalSettings = db.WeekavalSettings;

class AvailabilitiesService {
  createDynamicAval = createDynamicAval;
  retrieveAvailability = retrieveAvailability;
}

export default AvailabilitiesService;

const weekavalSetting = async () => {
  await WeekavalSettings.findAll()
    .then((daySetting: WorkSetting[]) => {
      if (daySetting.length > 0) {
        const result = daySetting.map((day: WorkSetting) => {
          return {
            day: day.day,
            availability: createDynamicAval(
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
        avalDefault.weekAvalSettings.map((day: any) => {
          WeekavalSettings.create({
            day: day.day,
            workTimeStart: day.parameters.workTimeRange.start,
            workTimeEnd: day.parameters.workTimeRange.end,
            breakTimeStart: day.parameters.breakTimeRange.start,
            breakTimeEnd: day.parameters.breakTimeRange.end,
            eventDurationHours: day.parameters.eventDuration.hours,
            eventDurationMinutes: day.parameters.eventDuration.minutes,
            breakTimeBtwEventsHours: day.parameters.breakTimeBtwEvents.hours,
            breakTimeBtwEventsMinutes:
              day.parameters.breakTimeBtwEvents.minutes,
          }).catch((e: any) => {
            throw e;
          });
        });
      }
    })
    .catch((e: any) => {
      next(e);
    });
};
