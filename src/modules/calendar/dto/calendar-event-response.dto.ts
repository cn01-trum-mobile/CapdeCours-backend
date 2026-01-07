import { ApiProperty } from '@nestjs/swagger';
import { CalendarEvent } from '../../../entities/CalendarEvent';

export class CalendarEventResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  constructor(entity: CalendarEvent) {
    this.id = entity.id;
    this.title = entity.title;
    this.notes = entity.notes;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
  }
}
