const { google } = require('googleapis');
const { GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET } =
  process.env;

console.log(process.env, 'GOOGLE_CALENDAR_CLIENT_ID');
const oauth2Client = new google.auth.OAuth2(
  '345460796534-lfe6gvqmqijc5g6h0l813gm82q1m7cl5.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/'
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = ['https://www.googleapis.com/auth/calendar'];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
});

console.log(url);

// const {tokens} = await oauth2Client.getToken(code)
// oauth2Client.setCredentials(tokens);
