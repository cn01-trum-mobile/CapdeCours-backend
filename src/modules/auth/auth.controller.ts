import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Trả URL để user login Google
  @Get('login-url')
  getLoginUrl() {
    const url = this.authService.getAuthUrl();
    return { url };
  }

  // Callback sau khi user login Google
  @Get('google/callback')
  async googleCallback(@Query('code') code: string) {
    // Lấy token trực tiếp từ Google
    const tokens = await this.authService.getTokens(code);

    // Lấy thông tin user (tuỳ chọn)
    const userInfo = await this.authService.getUserInfo(tokens);

    // Trả JSON token + user info
    return { token: tokens.access_token, refreshToken: tokens.refresh_token, user: userInfo };
  }
}
