const { google } = require('googleapis');

import { DateTime } from 'luxon';
import { RRule, RRuleSet } from 'rrule';

import { HOUR_MINUTE_FORMAT, lastDayOfyear, setTimeToDate } from '../../utils';

const rruleSet = new RRuleSet();

// insert calendar events using a service account authentication

const CREDENTIALS = process.env.CREDENTIALS;
//@ts-expect-error
const client_email = JSON.parse(CREDENTIALS).client_email;
//@ts-expect-error
const private_key = JSON.parse(CREDENTIALS).private_key;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT(client_email, null, private_key, SCOPES);

//TODO => put the below id in .env file

const calendarId = process.env.GOOGLE_CALENDAR_ID || undefined;

const daysShorted = (value: string) => {
  switch (value) {
    case 'Monday':
      return 'MO';

    case 'Tuesday':
      return 'TU';

    case 'Wednesday':
      return 'WE';

    case 'Thursday':
      return 'TH';

    case 'Friday':
      return 'FR';

    case 'Saturday':
      return 'SA';

    case 'Sunday':
      return 'SU';
  }
};

export const getRecurrencyRules = (p: {
  startDate: string;
  day: string = '2';
  exdate: string;
}): string[] => {
  const { startDate, day, exdate } = p;
  // Create a rule:
  const rule = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    //@ts-expect-error
    byweekday: [RRule[day]],
    until: lastDayOfyear.toJSDate(),
  });

  const hourMinuteFormat = HOUR_MINUTE_FORMAT(startDate);
  const exdateWithTime = setTimeToDate(exdate, hourMinuteFormat);

  // Add a exclusion date to rruleSet
  rruleSet.exdate(DateTime.fromISO(exdateWithTime).toUTC().toJSDate());

  // Add a rrule to rruleSet
  rruleSet.rrule(rule);

  return rruleSet.valueOf();
};

class GoogleCalendarService {
  event: any;

  constructor(p: {
    userEmail?: string;
    start?: string;
    end?: string;
    recurrentDay?: string;
    exceptionDate?: string;
  }) {
    const { userEmail, start, end, recurrentDay, exceptionDate } = p;

    const recurrencyRules =
      start &&
      exceptionDate &&
      recurrentDay &&
      getRecurrencyRules({
        startDate: start,
        day: daysShorted(recurrentDay) as string,
        exdate: exceptionDate,
      });

    this.event = {
      summary: userEmail,
      description: `${process.env.EVENT_DESCRIPTION} con ${userEmail}`,
      organizer: {
        email: process.env.ADMIN_EMAIL,
        displayName: process.env.ADMIN_NAME,
      },
      start: {
        dateTime: start,
        timeZone: recurrentDay && 'Europe/Rome',
      },
      end: {
        dateTime: end,
        timeZone: recurrentDay && 'Europe/Rome',
      },
      recurrence: recurrencyRules && recurrencyRules,
      colorId: 1,
    };
  }

  public async insertEvent() {
    try {
      console.log(this.event, 'eveeeent');
      const response = await calendar.events.insert({
        auth: auth,
        calendarId,
        resource: this.event,
      });

      if (response['status'] == 200 && response['statusText'] === 'OK') {
        return response.data.id;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return 0;
    }
  }
}

export const getEvents = async (eventId: string) => {
  try {
    const response = await calendar.events.list({
      auth: auth,
      calendarId,
      eventId: eventId,
    });

    const items = response['data']['items'];

    return items;
  } catch (error) {
    console.log(`Error at getEvents --> ${error}`);
    return 0;
  }
};

export const deleteEvent = async (eventId: any) => {
  try {
    const response = await calendar.events.delete({
      auth: auth,
      calendarId,
      eventId: eventId,
    });

    if (response.data === '') {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at deleteEvent --> ${error}`);
    return 0;
  }
};

export const updateEvent = async (eventId: string, resource: object) => {
  try {
    const response = await calendar.events.patch({
      auth: auth,
      calendarId,
      eventId: eventId,
      resource: resource,
    });

    const items = response['data']['items'];
    return items;
  } catch (error) {
    console.log(`Error at updateEvent --> ${error}`);
    return 0;
  }
};

export default GoogleCalendarService;
