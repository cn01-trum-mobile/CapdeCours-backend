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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // <--- Import Request từ express
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CalendarEventResponseDto } from './dto/calendar-event-response.dto';

// 1. Định nghĩa Interface cho User trong JWT (khớp với hàm validate trong strategy)
interface UserPayload {
  id: number;
  username: string;
  name: string;
}

// 2. Định nghĩa Interface Request mở rộng để TypeScript hiểu req.user là gì
interface RequestWithUser extends Request {
  user: UserPayload;
}

@ApiTags('Calendar')
@Controller('calendar')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Get all calendar events for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of events found',
    type: [CalendarEventResponseDto],
  })
  // 3. Thay @Req() req thành @Req() req: RequestWithUser
  async findAll(@Req() req: RequestWithUser) {
    const events = await this.calendarService.findAll(req.user.id);
    return events.map((event) => new CalendarEventResponseDto(event));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new calendar event' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: CalendarEventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Req() req: RequestWithUser,
    @Body() createEventDto: CreateEventDto,
  ) {
    const event = await this.calendarService.create(
      req.user.id,
      createEventDto,
    );
    return new CalendarEventResponseDto(event);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: CalendarEventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      const updatedEvent = await this.calendarService.update(
        id,
        req.user.id,
        updateEventDto,
      );
      return new CalendarEventResponseDto(updatedEvent);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.calendarService.remove(id, req.user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
