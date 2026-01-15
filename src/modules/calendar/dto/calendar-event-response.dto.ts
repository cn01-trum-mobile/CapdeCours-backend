import { ApiProperty } from '@nestjs/swagger';
import { CalendarEvent } from '../../../entities/CalendarEvent';

// Định nghĩa interface để Swagger hiểu cấu trúc bên trong của repeat
class RepeatRuleDto {
  @ApiProperty({ enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] })
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

  @ApiProperty()
  interval: number;

  @ApiProperty({ required: false })
  until?: Date;
}

export class CalendarEventResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false }) // Thêm trường location nếu bạn có dùng
  location?: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ default: '#AC3C00' })
  color: string;

  // THÊM Ở ĐÂY: Trả về thông tin lặp cho Frontend
  @ApiProperty({ type: RepeatRuleDto, required: false })
  repeat?: RepeatRuleDto;

  constructor(entity: CalendarEvent) {
    this.id = entity.id;
    this.title = entity.title;
    this.notes = entity.notes;
    this.location = entity.location;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.color = entity.color;
    // Map dữ liệu từ Entity sang DTO
    this.repeat = entity.repeat;
  }
}
