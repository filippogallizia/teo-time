const { google } = require('googleapis');
require('dotenv').config();

// insert calendar events using a service account authentication

const CREDENTIALS = process.env.CREDENTIALS;
//@ts-expect-error
const client_email = JSON.parse(CREDENTIALS).client_email;
//@ts-expect-error
const private_key = JSON.parse(CREDENTIALS).private_key;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT(client_email, null, private_key, SCOPES);

const calendarId =
  process.env.GOOGLE_CALENDAR_ID || 'galliziafilippo@gmail.com';

class GoogleCalendarService {
  event: any;

  constructor(userEmail: string, start: string, end: string) {
    this.event = {
      summary: process.env.EVENT_TYPE,
      location: process.env.EVENT_LOCATION,
      description: `${process.env.EVENT_DESCRIPTION} con ${userEmail}`,
      organizer: {
        email: process.env.ADMIN_EMAIL,
        displayName: process.env.ADMIN_NAME,
      },
      start: {
        dateTime: start,
      },
      end: {
        dateTime: end,
      },
      colorId: 1,
    };
  }

  public async insertEvent() {
    try {
      const response = await calendar.events.insert({
        auth: auth,
        calendarId,
        resource: this.event,
      });

      if (response['status'] == 200 && response['statusText'] === 'OK') {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(`Error at insertEvent --> ${error}`);
      return 0;
    }
  }

  async getEvents(dateTimeStart: string, dateTimeEnd: string) {
    try {
      const response = await calendar.events.list({
        auth: auth,
        calendarId,
        timeMin: dateTimeStart,
        timeMax: dateTimeEnd,
      });

      const items = response['data']['items'];
      return items;
    } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      return 0;
    }
  }

  async deleteEvent(eventId: any) {
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
  }
}

export const insertEvent = async (event: any) => {
  try {
    const response = await calendar.events.insert({
      auth: auth,
      calendarId,
      resource: event,
    });

    if (response['status'] == 200 && response['statusText'] === 'OK') {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
};

export const getEvents = async (dateTimeStart: string, dateTimeEnd: string) => {
  try {
    const response = await calendar.events.list({
      auth: auth,
      calendarId,
      timeMin: dateTimeStart,
      timeMax: dateTimeEnd,
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

export default GoogleCalendarService;
