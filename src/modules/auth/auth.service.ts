import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    if (await this.userService.findUserByUsername(createUserDto.username)) {
        throw new BadRequestException('Username already exists');
    }
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userService.findUserByUsername(username)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // So sánh password nhập vào với hash trong DB
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Nếu đúng, tạo JWT Token
    const payload = { 
        sub: user.id,          
        username: user.username, 
        name: user.name       
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}