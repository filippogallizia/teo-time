// const { google } = require('googleapis');
// const { OAuth2 } = google.auth;

// const OAuth2client = new OAuth2(
//   '345460796534-lfe6gvqmqijc5g6h0l813gm82q1m7cl5.apps.googleusercontent.com',
//   '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'
// );

// OAuth2client.setCredentials({
//   refresh_token:
//     '1//04dKBgT7UrqXmCgYIARAAGAQSNwF-L9IraaZNaAaL6rk93Rtr8hsTK-U1FDMTQ5IKttM1YPAbYLRlnRtoIYQX-z0NDiYiJvHgekQ',
// });

// const calendar = google.calendar({ version: 'v3', auth: OAuth2client });

// const eventStartTime = new Date();

// eventStartTime.setDate(eventStartTime.getDate() + 2);

// const eventEndtime = new Date();

// eventEndtime.setDate(eventEndtime.getDate() + 2);
// eventEndtime.setMinutes(eventEndtime.getMinutes() + 45);

// const event = {
//   summary: 'OSTEOPATIA CON TEO',
//   location: 'via Osti',
//   description: 'trattamento osteopatico',
//   start: {
//     dateTime: eventStartTime,
//     timeZone: 'Europe/Lisbon',
//   },
//   end: {
//     dateTime: eventEndtime,
//     timeZone: 'Europe/Lisbon',
//   },
//   colorId: 1,
// };

// // calendar.freebusy.query({}, (err, resp) => {});
// calendar.events.insert(
//   {
//     calendarId: 'primary',
//     resource: event,
//   },
//   (err) => {
//     // if (err) return console.error('Calendar event errror');
//     console.log(err, 'Calendar Event Inserted');
//   }
// );

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.list(
    {
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    }
  );
}
