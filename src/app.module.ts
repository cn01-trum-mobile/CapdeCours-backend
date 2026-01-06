import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './modules/orm.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    OrmModule, 
    UserModule,
    AuthModule, 
  ],
  controllers: [AppController], 
  providers: [AppService, Logger],
})
export class AppModule {}