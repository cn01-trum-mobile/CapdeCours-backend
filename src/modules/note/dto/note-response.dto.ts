import { ApiProperty } from '@nestjs/swagger';
import { Note } from '../../../entities/Note';

export class NoteResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  content?: string;


  constructor(note: Note) {
    this.id = note.id;
    this.title = note.title;
    this.content = note.content;
  }
}
