import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false, // Don't auto-run migrations
  synchronize: false, // Disable auto-sync for production safety
  logging: true, // Always enable logging for debugging
  ssl: {
    rejectUnauthorized: false,
  },
});
