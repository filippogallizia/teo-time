import { DateTime } from 'luxon';

import { HrsAndMinsType, TimeRangeType } from '../../../types/types';

/**
 * this function create aval slots given the following inputs
 * @param workTimeRange
 * @param breakTimeRange
 * @param eventDuration
 * @param breakTimeBtwEventsx
 */
export const createAvalAlgoritm = (
  workTimeRange: TimeRangeType,
  breakTimeRange: TimeRangeType,
  eventDuration: HrsAndMinsType,
  breakTimeBtwEvents: HrsAndMinsType
): TimeRangeType[] => {
  const bucket: { start: DateTime; end: DateTime }[] = [];
  const dayStart = DateTime.fromISO(workTimeRange.start);
  const dayEnd = DateTime.fromISO(workTimeRange.end);
  const breakStart = DateTime.fromISO(breakTimeRange.start);
  const breakEnd = DateTime.fromISO(breakTimeRange.end);

  const fn = (): { start: DateTime; end: DateTime }[] => {
    const lastSlot =
      bucket.length === 0
        ? { start: dayStart, end: dayStart }
        : Object.create(bucket[bucket.length - 1]);

    let lastSlotEnd = lastSlot.end;

    // general validations on dayStart end dayEnd
    if (dayStart >= breakStart && dayEnd <= breakEnd) {
      return [];
    }

    // validations on dynamic bucket
    if (
      (lastSlotEnd.plus(breakTimeBtwEvents) >= breakStart &&
        lastSlotEnd.plus(breakTimeBtwEvents) < breakEnd) ||
      (lastSlotEnd.plus(eventDuration).plus(breakTimeBtwEvents) > breakStart &&
        lastSlotEnd.plus(eventDuration).plus(breakTimeBtwEvents) <= breakEnd)
    ) {
      lastSlotEnd = breakEnd;
    }

    if (lastSlotEnd.plus(eventDuration).plus(breakTimeBtwEvents) > dayEnd) {
      return bucket;
    }

    const isFirstSlotOfDayOrAfterBreak =
      lastSlotEnd === dayStart || lastSlotEnd === breakEnd;

    bucket.push({
      start: isFirstSlotOfDayOrAfterBreak
        ? lastSlotEnd
        : lastSlotEnd.plus(breakTimeBtwEvents),
      end: isFirstSlotOfDayOrAfterBreak
        ? lastSlotEnd.plus(eventDuration)
        : lastSlotEnd.plus(eventDuration).plus(breakTimeBtwEvents),
    });

    return fn();
  };

  fn();

  return bucket.map((obj: { start: DateTime; end: DateTime }) => {
    return {
      start: obj.start.toUTC().toISO(),
      end: obj.end.toUTC().toISO(),
    };
  });
};
