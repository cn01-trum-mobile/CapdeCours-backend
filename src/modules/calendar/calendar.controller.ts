import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { google } from 'googleapis';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents(@Query('token') token: string) {
    if (!token) throw new UnauthorizedException('Access token is required');

    // Tạo OAuth2 client với token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    // Truyền client vào CalendarService
    this.calendarService.setAuth(oauth2Client);

    // Lấy events
    return this.calendarService.getEvents();
  }
}
