const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const User = require("../../models/user");
const { authUrl } = require("./event-manager");
const { OAuth2Client } = require('google-auth-library');

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "third-party/google-calendar/token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "third-party/google-calendar/credentials1.json"
);

// storing the events locally
const myEvents = [];

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist(emailId) {
  // We will consider that user is already created before we go for google auth.
  User.fetch(emailId)
    .then(([users, fieldData]) => {
      const content = users[0]["googleAuthJSON"];
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    })
    .catch((error) => console.log(error));
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client, emailId) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });

  User.update(emailId, payload)
    .then((result) => {
      return;
    })
    .catch((error) => console.log(error));
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize(emailId) {
  let client = await loadSavedCredentialsIfExist(emailId);
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client, emailId);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  // myEvents.push(events);
  // console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
    myEvents.push(event);
  });
}

async function deleteEvent(eventId) {
  const auth = await authorize();

  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });
  console.log(res.status);
}

async function getMyEvents(emailId) {
  await authorize(emailId).then(listEvents).catch(console.error);
  return myEvents;
}

async function generateAuthUrl(emailId) {
  console.log(CREDENTIALS_PATH);
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  
  console.log(key);

  const client = new OAuth2Client({
    clientId: key.client_id,
    clientSecret: key.client_secret,
    redirectUri: key.redirect_uris[0]
  });
  
  // Generate a URL for the user to authorize the app
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  return authUrl;
}

exports.generateAuthUrl = generateAuthUrl;
exports.getMyEvents = getMyEvents;
exports.deleteEvent = deleteEvent;
