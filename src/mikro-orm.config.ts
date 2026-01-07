import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { User } from './entities/User';
import { CalendarEvent } from './entities/CalendarEvent';

const logger = new Logger('MikroORM');

export default defineConfig({
  entities: [User, CalendarEvent],

  dbName: process.env.DB_NAME || 'mobile-demo',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',

  debug: true,
  logger: logger.log.bind(logger),

  extensions: [Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
  },
});
