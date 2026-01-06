import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

function createWinstonOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  const useGcpCloudLogging = process.env.USE_GCP_CLOUD_LOGGING !== undefined && ['true', 'on', 'yes', '1'].includes(process.env.USE_GCP_CLOUD_LOGGING.toLowerCase());

  const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(
      ({ timestamp, level, message, context, ...meta }) => {
        const contextString = context ? ` [${context}]` : '';
        const metaString = Object.keys(meta).length
          ? `\n${JSON.stringify(meta, null, 2)}`
          : '';

        return `${timestamp} ${level}${contextString}: ${message}${metaString}`;
      },
    ),
  );

  const transports: winston.transport[] = [];

  if (useGcpCloudLogging) {
    transports.push(new LoggingWinston());
  }
  transports.push(new winston.transports.Console({
    format: consoleFormat,
  }));

  return {
    level: isProduction ? 'info' : 'debug',
    transports
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createWinstonOptions()),
  });

  // Kích hoạt CORS
  app.enableCors();

  // await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  // await app.get(MikroORM).getSchemaGenerator().updateSchema();

  // THÊM đoạn này: Tự động chạy migration khi khởi động server
  const orm = app.get(MikroORM);
  // Tạo DB nếu chưa có (chỉ check connection/create db, không tạo bảng)
  if (!await orm.isConnected()) {
      await orm.connect(); // Đảm bảo kết nối
  }

  // ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Cấu hình Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mobile Demo API')
    .setDescription('API documentation for Mobile Application Development demo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();