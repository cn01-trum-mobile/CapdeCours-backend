import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Lấy token từ Header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Lấy secret key từ .env để verify chữ ký token
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Hàm này chạy khi Token hợp lệ.
  // Kết quả trả về sẽ được gắn vào req.user trong Controller
  async validate(payload: any) {
    // Map dữ liệu trả về req.user
    return {
      id: payload.sub,
      username: payload.username,
      name: payload.name,
    };
  }
}
