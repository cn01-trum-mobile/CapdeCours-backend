import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core'; // Hoặc @mikro-orm/postgresql
import { CalendarEvent } from '../../entities/CalendarEvent';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../../entities/User';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly eventRepo: EntityRepository<CalendarEvent>,
  ) {}

  // Nhận userId thay vì entity User
  async findAll(userId: number) {
    // MikroORM đủ thông minh để hiểu { user: userId } là tìm theo foreign key
    return this.eventRepo.find({ user: userId });
  }

  async create(userId: number, dto: CreateEventDto) {
    // Quan trọng: Lấy EntityManager để tạo Reference.
    // Điều này giúp gán user cho event mà KHÔNG cần query database để lấy User Entity.
    const userRef = this.eventRepo
      .getEntityManager()
      .getReference(User, userId);

    const event = this.eventRepo.create({
      ...dto,
      user: userRef, // Gán reference user vào đây
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });

    await this.eventRepo.getEntityManager().persist(event).flush();
    return event;
  }

  async update(id: number, userId: number, dto: Partial<CreateEventDto>) {
    // Tìm event thuộc về userId này
    const event = await this.eventRepo.findOne({ id, user: userId });

    if (!event) throw new NotFoundException('Event not found or access denied');

    if (dto.title) event.title = dto.title;
    if (dto.notes !== undefined) event.notes = dto.notes;
    if (dto.location !== undefined) event.location = dto.location;
    if (dto.startDate) event.startDate = new Date(dto.startDate);
    if (dto.endDate) event.endDate = new Date(dto.endDate);

    await this.eventRepo.getEntityManager().flush();
    return event;
  }

  async remove(id: number, userId: number) {
    // Chỉ xóa nếu event đó thuộc về userId đang đăng nhập
    const event = await this.eventRepo.findOne({ id, user: userId });

    if (!event) throw new NotFoundException('Event not found or access denied');

    await this.eventRepo.getEntityManager().remove(event).flush();
    return { success: true };
  }
}
