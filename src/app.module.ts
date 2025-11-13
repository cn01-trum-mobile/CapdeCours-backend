import { Logger, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule, AuthModule, CalendarModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
