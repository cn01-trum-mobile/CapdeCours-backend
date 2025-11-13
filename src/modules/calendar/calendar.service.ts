import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  private auth: any;

  setAuth(authClient: any) {
    this.auth = authClient;
  }

  async getEvents() {
    if (!this.auth) throw new Error('Auth client not set');

    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    try {
      const res = await calendar.events.list({
        calendarId: 'primary',
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return res.data.items;
    } catch (err) {
      console.error('Google Calendar API error:', err);
      throw new Error('Failed to fetch calendar events');
    }
  }
}
