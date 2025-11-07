import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'gasless_user',
  password: process.env.DATABASE_PASS || 'gasless_password',
  database: process.env.DATABASE_NAME || 'gasless',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/infrastructure/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
