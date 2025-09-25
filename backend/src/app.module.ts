import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { TradeModule } from './trade/trade.module';
import { RoomThemesModule } from './room-themes/room-themes.module';
import { CacheModule } from './cache/cache.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';


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
    DatabaseModule,
    HealthModule,
    EventEmitterModule.forRoot(),
    CacheModule,
    LeaderboardsModule,
    ...loadModules(),
    TradeModule,
    SecretsModule,
    PodcastRoomsModule,
    GamblesModule,
    RoomThemesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
