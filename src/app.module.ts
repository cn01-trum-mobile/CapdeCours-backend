import { Logger, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule,NoteModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
