import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI, // ví dụ: http://localhost:3000/auth/google/callback
  );

  // Trả URL để user login Google
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // lấy refresh token
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
      prompt: 'consent',
    });
  }

  // Dùng code để lấy access token từ Google
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens; // trả về access_token, refresh_token, expiry_date
  }

  // Lấy thông tin user từ Google API
  async getUserInfo(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const res = await oauth2.userinfo.get();
    return res.data; // { id, email, name, picture, ... }
  }
}
