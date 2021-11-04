const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const OAuth2client = new OAuth2(
  '345460796534-lfe6gvqmqijc5g6h0l813gm82q1m7cl5.apps.googleusercontent.com',
  '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'
);

OAuth2client.setCredentials({
  refresh_token:
    '1//04dKBgT7UrqXmCgYIARAAGAQSNwF-L9IraaZNaAaL6rk93Rtr8hsTK-U1FDMTQ5IKttM1YPAbYLRlnRtoIYQX-z0NDiYiJvHgekQ',
});

const calendar = google.calendar({ version: 'v3', auth: OAuth2client });

const eventStartTime = new Date();

eventStartTime.setDate(eventStartTime.getDate() + 2);

const eventEndtime = new Date();

eventEndtime.setDate(eventEndtime.getDate() + 2);
eventEndtime.setMinutes(eventEndtime.getMinutes() + 45);

const event = {
  summary: 'OSTEOPATIA CON TEO',
  location: 'via Osti',
  description: 'trattamento osteopatico',
  start: {
    dateTime: eventStartTime,
    timeZone: 'Europe/Lisbon',
  },
  end: {
    dateTime: eventEndtime,
    timeZone: 'Europe/Lisbon',
  },
  colorId: 1,
};

// calendar.freebusy.query({}, (err, resp) => {});
calendar.events.insert(
  {
    calendarId: 'primary',
    resource: event,
  },
  (err) => {
    if (err) return console.error('Calendar event errror');
    console.log('Calendar Event Inserted');
  }
);
