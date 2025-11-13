import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MongoEntityRepository, MongoEntityManager, ObjectId } from '@mikro-orm/mongodb';
import { User } from '../../entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: MongoEntityRepository<User>,
    private readonly em: MongoEntityManager, // dùng để persist/remove
  ) {}

  @Get()
  @ApiOperation({ summary: 'List up to 20 users' })
  @ApiResponse({ status: 200, description: 'Found users', type: [UserResponseDto] })
  async find() {
    const users = await this.userRepository.find({}, { limit: 20, orderBy: { name: 'DESC' } });
    return users.map(user => new UserResponseDto(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiResponse({ status: 200, description: 'The found user', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.userRepository.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return new UserResponseDto(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.em.persistAndFlush(user); // lưu thông qua EntityManager
    return new UserResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateUserDto);
    await this.em.persistAndFlush(user); // update thông qua EntityManager

    return new UserResponseDto(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string) {
    const user = await this.userRepository.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.em.removeAndFlush(user); // xóa thông qua EntityManager
  }
}
