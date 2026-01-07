import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from '../entities/User';
import { CalendarEvent } from '../entities/CalendarEvent';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [User, CalendarEvent],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
