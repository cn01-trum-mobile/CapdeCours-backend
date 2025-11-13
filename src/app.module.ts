import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './modules/orm.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { NoteController } from './modules/note/note.controller';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [OrmModule, UserModule, NoteModule],
  controllers: [AppController, UserController , NoteController],
  providers: [AppService, Logger],
})
export class AppModule {}