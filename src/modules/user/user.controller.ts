import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) 
  @Get('profile')
  getProfile(@Req() req) {
    return req.user; 
  }

  @Get()
  @ApiOperation({ summary: 'List up to 20 users' })
  @ApiResponse({
    status: 200,
    description: 'Found users',
    type: [UserResponseDto],
  })
  async find() {
    const users = await this.userService.find();
    return users.map((e) => new UserResponseDto(e));
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get a single user by username' })
  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new HttpException(
        `User with username ${username} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return new UserResponseDto(user);
  }


  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return new UserResponseDto(user);
  }

  @Patch(':username')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(
        username,
        updateUserDto,
      );

      return new UserResponseDto(updatedUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':username')
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('username') username: string) {
    try {
      await this.userService.deleteUser(username);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
