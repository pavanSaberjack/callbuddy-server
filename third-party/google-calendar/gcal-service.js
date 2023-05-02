const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");

// Replace with your client ID and secret
const CLIENT_ID =
  "177298629480-vsds0f8e9g3al5qqgu2nnojmqpvk1vqr.apps.googleusercontent.com";
const CLIENT_ID1 = "177298629480-4ddd096opvtpbsf13t9gdktujkls99i9.apps.googleusercontent.com";
const CLIENT_SECRET = "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"; // "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";

// Replace with your redirect URI
const REDIRECT_URI = "http://localhost:8080/user/auth";

// Replace with the desired Google API scope
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Create a new OAuth2Client with your client ID and secret
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Use the idToken to authenticate the user and obtain an access token
async function authenticateUser(idToken, refresh_token, access_token) {
  
  const ticket = await oAuth2Client.verifyIdToken({
    idToken,
    audience: [CLIENT_ID, CLIENT_ID1]
  });

  const { sub: userId, email } = ticket.getPayload();

  oAuth2Client.setCredentials({
    refresh_token: refresh_token,
    access_token: access_token,
    scope: SCOPES
  });

  return { userId, email };
}

// Call the desired Google API using the access token
async function callGoogleApi(userId) {
  
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  console.log(events.data);
  return events.data;
}

async function getMyEvents(idToken, refresh_token, access_token) {
  if (!idToken) {
    console.log("idToken is null");
    return;
  }

  if (!refresh_token) {
    console.log("refresh_token is null");
    return;
  }

  if (!access_token) {
    console.log("access_token is null");
    return;
  }

  const { userId, email } = await authenticateUser(idToken, refresh_token, access_token);
  const events = await callGoogleApi(userId);
  return events;

  // authenticateUser(idToken)
  //     .then(({userId}) => callGoogleApi(userId))
  //     .catch(console.error);

  // await authorize(emailId).then(listEvents).catch(console.error);
  // return myEvents;
}

// Example usage
// const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YWZkYTM2ODJlYmYwOWViMzA1NWMxYzRiZDM5Yjc1MWZiZjgxOTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNzcyOTg2Mjk0ODAtNGRkZDA5Nm9wdnRwYnNmMTN0OWdka3R1amtsczk5aTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNzcyOTg2Mjk0ODAtdnNkczBmOGU5ZzNhbDVxcWd1Mm5ub2ptcXB2azF2cXIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgwMDEzMDIzNjE3NTE2MTI5OTkiLCJlbWFpbCI6Iml0YWdpNzVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ0cHZ0a3NMUnVRUUpwdHpWNjVMS193IiwibmFtZSI6IlBhdmFuIEl0YWdpIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eGFkWndabGFSa0hPTVVPbkVfWlFycmpFUnZib25kZUNjWmFCZzdyWVE9czk2LWMiLCJnaXZlbl9uYW1lIjoiUGF2YW4iLCJmYW1pbHlfbmFtZSI6Ikl0YWdpIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE2ODI5NTI3OTMsImV4cCI6MTY4Mjk1NjM5M30.dr67ZYw5QRxcYtMh0IhajSye2KxZqKKbRrCFnpeV8lYPgYjhDaIZDLu3KtSeWnfHJO1OWUD-_b3Dx61fPDu3ic0HHview1ZxPFSCYA8l2k1E7w0EpzI5wGyVrdSMz7H-rgYMe_TJXi9IAVQHS_Zi77de2SPjnEJ6dE4lEOCi8G72cGLy0PdbGh_A3qpH2KxYtvGGuGbtUdGKGLOZDdA2YyWwBibv04mH-ysk1F35a2B0ixdJZgZf_JHlazEwfbn1YRQ0LKd0r8dGOvJ2ibr2dd_tTqjmz7WtlJHWQ-hvw2Xam-lZn2BgOr2kp5oWQqcIPkdD3ZtCfc_ugpPp_DSjqw';

exports.getMyEvents = getMyEvents;
