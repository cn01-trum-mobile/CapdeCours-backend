import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Note } from '../../entities/Note';
import { NoteController } from './note.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Note])],
  controllers: [NoteController],
})
export class NoteModule {}
