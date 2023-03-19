const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const fs = require("fs").promises;
const path = require("path");
const process = require("process");


const CREDENTIALS_PATH = path.join(
    process.cwd(),
    "third-party/google-calendar/credentials.json"
  );
const tokenFilePath = path.join(
    process.cwd(), 
    "third-party/google-calendar/token.json"
    ); // the file path to store the access token and refresh token

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    
// Create a new OAuth2 client
const oAuth2Client = new OAuth2Client(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

// Create a new MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase',
});

// Authorize the OAuth2 client and retrieve the access token and refresh token
async function authorize() {
  try {
    const { tokens } = await oAuth2Client.getToken({
      code: authorizationCode,
    });
    oAuth2Client.setCredentials(tokens);
    console.log('Access token:', tokens.access_token);
    console.log('Refresh token:', tokens.refresh_token);
  } catch (error) {
    console.error('Error retrieving access token:', error);
  }
}

// Make a request to the Google Calendar API and retrieve the events
async function getEvents() {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const { data } = await calendar.events.list({
        calendarId: credentials.web.calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return data.items;
  } catch (error) {
    console.error('Error retrieving events:', error);
  }
}

// Connect to the MySQL database and insert the events
async function insertEvents(events) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const insertPromises = events.map((event) => {
      const sql = 'INSERT INTO events (name, start_time, end_time) VALUES (?, ?, ?)';
      const values = [event.summary, event.start.dateTime, event.end.dateTime];
      return connection.query(sql, values);
    });
    await Promise.all(insertPromises);
    await connection.commit();
    console.log('Events inserted successfully!');
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting events:', error);
  } finally {
    connection.release();
  }
}

// Call the functions in sequence
authorize().then(() => {
  return getEvents();
}).then((events) => {
  return insertEvents(events);
}).catch((error) => {
    console.log(error);
})
