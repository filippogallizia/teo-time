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

console.log(client_email, 'client_email');

const calendarId =
  process.env.GOOGLE_CALENDAR_ID || 'galliziafilippo@gmail.com';

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
