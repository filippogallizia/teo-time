const AvaliabilityGeneralRules = require('./config/timeConditions.config.json');
const { DateTime } = require('luxon');

//types

type SlotTypeGeneral = {
  start: number;
  end: number;
};

type SlotTypeSpecific = {
  start: Date;
  end: Date;
};

type AvaliabilityGrid = {
  AvaliabilityGeneralRules: {
    day: string;
    availability: SlotTypeGeneral[];
  }[];
};

type BookingGrid = {
  bookings: SlotTypeSpecific[];
};

// constant datas

const rangeProvided: SlotTypeSpecific = {
  start: DateTime.fromISO('2021-10-05T09:00:00.000'),
  end: DateTime.fromISO('2021-10-05T21:00:00.000'),
};

const bookingGrid: BookingGrid = {
  bookings: [
    {
      start: DateTime.fromISO('2021-09-05T09:00:00.000'),
      end: DateTime.fromISO('2021-10-05T11:00:00.000'),
    },
    {
      start: DateTime.fromISO('2021-10-05T13:00:00.000'),
      end: DateTime.fromISO('2021-10-05T15:00:00.000'),
    },
  ],
};

const coefficient = 0.5;

// helpers

const dateTimesAreSameDay = (dateTime1: any, dateTime2: any) => {
  return (
    dateTime1.month === dateTime2.month &&
    dateTime1.day === dateTime2.day &&
    dateTime1.year === dateTime2.year
  );
};

const closureFunction = (initialState: SlotTypeGeneral[]) => {
  const emptyArray: SlotTypeGeneral[] = [];
  return function filo() {
    initialState.forEach((objectSlot) => {
      emptyArray.push({
        start: objectSlot.start,
        end: objectSlot.start + coefficient,
      });
      while (
        objectSlot.end > emptyArray[emptyArray.length - 1].end &&
        objectSlot.end - emptyArray[emptyArray.length - 1].end >= coefficient
      ) {
        emptyArray.push({
          start: emptyArray[emptyArray.length - 1].end,
          end: emptyArray[emptyArray.length - 1].end + coefficient,
        });
      }
    });
    return emptyArray;
  };
};

const getAvailabilityFromGeneraRules = (
  myAvailabilities: AvaliabilityGrid
): {
  day: string;
  availability: SlotTypeGeneral[];
}[] => {
  return myAvailabilities.AvaliabilityGeneralRules.map((slot) => {
    const getAvailabilityInSlots = closureFunction(slot.availability);
    return {
      day: slot.day,
      availability: getAvailabilityInSlots(),
    };
  });
};

const getAvailabilityFromBooking = (
  rangeProvided: SlotTypeSpecific,
  bookingGrid: BookingGrid
) => {
  const result = bookingGrid.bookings.filter((booking) => {
    return (
      booking.start >= rangeProvided.start && booking.end <= rangeProvided.end
    );
  });
  return result;
};

console.log(getAvailabilityFromBooking(rangeProvided, bookingGrid), 'adeus');
