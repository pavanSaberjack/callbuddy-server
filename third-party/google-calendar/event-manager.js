// const { google } = require('googleapis');
// const { OAuth2Client } = require('google-auth-library');

// const fs = require("fs").promises;
// const path = require("path");
// const process = require("process");

// const db = require('../../util/database');

// const CREDENTIALS_PATH = path.join(
//     process.cwd(),
//     "third-party/google-calendar/credentials.json"
//   );
// const tokenFilePath = path.join(
//     process.cwd(), 
//     "third-party/google-calendar/token.json"
//     ); // the file path to store the access token and refresh token

// // Generate a URL for the user to authorize the app
// const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/calendar']
// });

// // Authorize the OAuth2 client and retrieve the access token and refresh token
// async function authorize() {
//     const credentials = await JSON.parse(fs.readFile(CREDENTIALS_PATH));
//     // Create a new OAuth2 client
//     const oAuth2Client = new OAuth2Client(
//         credentials.web.client_id,
//         credentials.web.client_secret,
//         credentials.web.redirect_uris[0]
//     );

//   try {
//     const { tokens } = await oAuth2Client.getToken({
//       code: authorizationCode,
//     });
//     oAuth2Client.setCredentials(tokens);
//     console.log('Access token:', tokens.access_token);
//     console.log('Refresh token:', tokens.refresh_token);
//   } catch (error) {
//     console.error('Error retrieving access token:', error);
//   }
// }

// // Make a request to the Google Calendar API and retrieve the events
// async function getEvents() {
//     await authorize(emailId).then(listEvents).catch(console.error);


//   try {
//     const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
//     const { data } = await calendar.events.list({
//         calendarId: "primary",
//         timeMin: new Date().toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: 'startTime',
//     });
//     return data.items;
//   } catch (error) {
//     console.error('Error retrieving events:', error);
//   }
// }

// // Connect to the MySQL database and insert the events
// async function insertEvents(events) {
//   try {
//     await db.beginTransaction();
//     const insertPromises = events.map((event) => {
//       const sql = 'INSERT INTO events (name, start_time, end_time) VALUES (?, ?, ?)';
//       const values = [event.summary, event.start.dateTime, event.end.dateTime];
//       return db.execute(sql, values);
//     });
//     await Promise.all(insertPromises);
//     await db.commit();
//     console.log('Events inserted successfully!');
//   } catch (error) {
//     await db.rollback();
//     console.error('Error inserting events:', error);
//   } finally {
//     db.release();
//   }
// }

// // Call the functions in sequence
// authorize().then(() => {
//   return getEvents();
// }).then((events) => {
//   return insertEvents(events);
// }).catch((error) => {
//     console.log(error);
// })


// exports.authUrl = authUrl;
// exports.deleteEvent = deleteEvent;