import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  QueryOrder,
  wrap,
} from '@mikro-orm/postgresql';
import { User } from '../../entities/User';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async find() {
    const users = await this.UserRepository.findAll({
      populate: ['name', 'username'],
      orderBy: { name: QueryOrder.DESC },
      limit: 20,
    });
    return users;
  }

  async findUserByUsername(username: string) {
    const user = await this.UserRepository.findOne(
      { username },
      {
        populate: ['id', 'name'],
      },
    );
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
    const user = this.UserRepository.create({
      ...rest,
      passwordHash: hashedPassword,
    });
    await this.em.flush();
    return user;
  }

  async updateUser(username: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    const { password, ...rest } = updateUserDto;

    wrap(user).assign(rest);
    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
      user.passwordHash = hashedPassword;
    }

    await this.em.flush();
    return user;
  }
  
  async deleteUser(username: string) {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    await this.em.removeAndFlush(user);
  }
}
