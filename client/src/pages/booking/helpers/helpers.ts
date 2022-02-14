import { DateTime } from 'luxon';
import { TimeRangeType } from '../../../../types/Types';
import {
  DATE_TO_DAY_FORMAT,
  FROM_DATE_TO_DAY,
  FROM_DATE_TO_HOUR,
  HOUR_MINUTE_FORMAT,
} from '../../../helpers/utils';

export const compareAvailWithCurrentHour = (
  availabilities: TimeRangeType[],
  selectedDay: string
): TimeRangeType[] => {
  return availabilities.reduce(
    (acc: { start: string; end: string }[], cv: TimeRangeType) => {
      const avalDay = FROM_DATE_TO_DAY(cv.start);
      const avalHours = FROM_DATE_TO_HOUR(cv.start);
      const currentDay = FROM_DATE_TO_DAY(new Date().toISOString());
      const currentHour = FROM_DATE_TO_HOUR(new Date().toISOString());
      if (
        avalDay === currentDay &&
        DATE_TO_DAY_FORMAT(selectedDay) ===
          DateTime.fromJSDate(new Date()).toFormat('yyyy LLL dd')
      ) {
        if (avalHours > currentHour) {
          acc.push({
            start: HOUR_MINUTE_FORMAT(cv.start),
            end: HOUR_MINUTE_FORMAT(cv.end),
          });
        }
      } else {
        acc.push({
          start: HOUR_MINUTE_FORMAT(cv.start),
          end: HOUR_MINUTE_FORMAT(cv.end),
        });
      }
      return acc;
    },
    []
  );
};
