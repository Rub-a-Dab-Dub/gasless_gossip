import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

function loadModules(): (new () => any)[] {
  const modulesDir = path.join(__dirname);
  const moduleFiles = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        fs.existsSync(
          path.join(modulesDir, dirent.name, `${dirent.name}.module.js`),
        ),
    )
    .map((dirent) => {
      const modulePath = path.join(
        modulesDir,
        dirent.name,
        `${dirent.name}.module.js`,
      );
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const imported = require(modulePath) as Record<string, unknown>;
      const moduleClass = Object.values(imported).find(
        (exp: unknown) =>
          typeof exp === 'function' &&
          /Module$/.test((exp as { name?: string }).name || ''),
      );
      return moduleClass as new () => any;
    })
    .filter(Boolean);

  return moduleFiles;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    HealthModule,
    ...loadModules(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}