import { Logger } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/mongodb';
import { User } from './entities/User';

const logger = new Logger('MikroORM');

export default defineConfig({
  entities: [User],
  dbName: 'mobile-demo',
  clientUrl: process.env.MONGO_URI ?? 'mongodb://localhost:27017',
  debug: true,
  logger: logger.log.bind(logger),
});
