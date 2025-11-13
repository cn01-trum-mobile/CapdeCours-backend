import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityRepository, QueryOrder, wrap, EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Note } from '../../entities/Note';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteResponseDto } from './dto/note-response.dto';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: EntityRepository<Note>,
    private readonly em: EntityManager,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List up to 20 notes' })
  @ApiResponse({ status: 200, description: 'Found notes', type: [NoteResponseDto] })
  async find() {
    const notes = await this.noteRepository.findAll({
      limit: 20,
    });
    return notes.map((n) => new NoteResponseDto(n));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single note by ID' })
  @ApiResponse({ status: 200, description: 'The found note', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const note = await this.noteRepository.findOne(id);
    if (!note) {
      throw new HttpException(`Note with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return new NoteResponseDto(note);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: NoteResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createNoteDto: CreateNoteDto) {
    const note = this.noteRepository.create(createNoteDto);
    await this.em.persistAndFlush(note);
    return new NoteResponseDto(note);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateNoteDto: UpdateNoteDto) {
    const note = await this.noteRepository.findOne(id);
    if (!note) {
      throw new HttpException(`Note with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    wrap(note).assign(updateNoteDto);
    await this.em.flush();

    return new NoteResponseDto(note);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing note' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const note = await this.noteRepository.findOne(id);
    if (!note) {
      throw new HttpException(`Note with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.em.removeAndFlush(note);
  }
}
