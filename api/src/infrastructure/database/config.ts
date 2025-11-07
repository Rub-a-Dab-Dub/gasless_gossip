import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'gasless_user',
  password: process.env.DATABASE_PASS || 'gasless_password',
  database: process.env.DATABASE_NAME || 'gasless',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Never use true in production
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false, // Set to true to auto-run migrations on app start
};

console.log('Database config:', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
});

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
