import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { CalendarEvent } from '../../entities/CalendarEvent';

@Module({
  // Đăng ký Entity CalendarEvent để Repository hoạt động
  imports: [MikroOrmModule.forFeature([CalendarEvent])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService], // Export nếu module khác cần dùng service này
})
export class CalendarModule {}
