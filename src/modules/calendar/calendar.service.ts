import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, assign } from '@mikro-orm/core'; // Thêm assign ở đây
import { CalendarEvent } from '../../entities/CalendarEvent';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../../entities/User';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly eventRepo: EntityRepository<CalendarEvent>,
  ) {}

  async findAll(userId: number) {
    // MikroORM sẽ tự động lấy cả trường 'repeat' vì nó đã định nghĩa trong Entity
    return this.eventRepo.find(
      { user: userId },
      { orderBy: { startDate: 'ASC' } },
    );
  }

  async create(userId: number, dto: CreateEventDto) {
    const userRef = this.eventRepo
      .getEntityManager()
      .getReference(User, userId);

    const event = this.eventRepo.create({
      ...dto,
      user: userRef,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      // Trường repeat sẽ tự động được map vào nếu dto.repeat tồn tại
    });

    await this.eventRepo.getEntityManager().persist(event).flush();
    return event;
  }

  async update(id: number, userId: number, dto: Partial<CreateEventDto>) {
    const event = await this.eventRepo.findOne({ id, user: userId });

    if (!event) throw new NotFoundException('Event not found or access denied');

    // Sử dụng assign để update hàng loạt các field đơn giản (title, notes, location, repeat)
    // Những field cần xử lý logic (như convert Date) thì xử lý riêng
    assign(event, {
      title: dto.title,
      notes: dto.notes,
      location: dto.location,
      repeat: dto.repeat, // Cập nhật nguyên object JSON
    });

    if (dto.startDate) event.startDate = new Date(dto.startDate);
    if (dto.endDate) event.endDate = new Date(dto.endDate);

    await this.eventRepo.getEntityManager().flush();
    return event;
  }

  async remove(id: number, userId: number) {
    const event = await this.eventRepo.findOne({ id, user: userId });
    if (!event) throw new NotFoundException('Event not found or access denied');

    await this.eventRepo.getEntityManager().remove(event).flush();
    return { success: true };
  }
}
