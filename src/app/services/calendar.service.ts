import {Injectable, OnInit} from '@angular/core';
import ErrnoException = NodeJS.ErrnoException;

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';


@Injectable({
  providedIn: 'root'
})
export class CalendarService implements OnInit {
  oAuth2Client :any;
  calendarId = 'rsbbr4bmo3p52o0e3omtdm3vko@group.calendar.google.com'
  constructor() {
  }

  ngOnInit(): void {
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      this.authorize(JSON.parse(content), this.listEvents);
    });
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials: any, callback: any) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err: ErrnoException | null, token: any) => {
      if (err) return this.getAccessToken(this.oAuth2Client, callback);
      this.oAuth2Client.setCredentials(JSON.parse(token));
      callback(this.oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken(oAuth2Client: any, callback: any) {
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
   * Lists the next 10 events on the user's SORELAX calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  listEvents(): string {
    let list  = '';
    const calendar = google.calendar({version: 'v3', auth: this.oAuth2Client});
    calendar.events.list({
      calendarId: this.calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        list = events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);

        });
      } else {
        console.log('No upcoming events found.');
      }
    });
    return list;
  }
}
