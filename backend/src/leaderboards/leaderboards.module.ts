import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

// Entities
import { Level } from '../levels/entities/level.entity';

// Services
import { LeaderboardsService } from './services/leaderboards.service';

// Controllers
import { LeaderboardsController } from './controllers/leaderboards.controller';

// Listeners
import { LeaderboardCacheListener } from './listeners/leaderboard-cache.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Level]),
    CacheModule.register({
      ttl: 300, // 5 minutes
      max: 1000,
    }),
    EventEmitterModule,
    ConfigModule,
  ],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService, LeaderboardCacheListener],
  exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
