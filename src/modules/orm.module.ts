import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from "../entities/User";
import { Note } from '../entities/Note';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [User, Note],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule { }