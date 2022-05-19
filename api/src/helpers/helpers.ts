import { DateTime } from "luxon";

export const parseDateToBeUserFriendly = (date: string) => {
  // here I need to parse it to JSdate and then to Datetime date ( otherwise dont work dont know why )
  const bookingStartTime = new Date(date);
  
  return  DateTime.fromJSDate(bookingStartTime)
    .toFormat('yyyy LLL dd t')
    .toString();
};
