import { Module, Global, OnModuleInit } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheWarmupService } from './cache-warmup.service';
import { CacheInvalidationService } from './cache-invalidation.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
          },
          password: configService.get('REDIS_PASSWORD'),
          ttl: 60 * 60 * 1000, // 1 hour default TTL
          max: 1000, // Max items in cache
        }),
        isGlobal: true,
      }),
    }),
  ],
  providers: [CacheWarmupService, CacheInvalidationService],
  exports: [NestCacheModule, CacheWarmupService, CacheInvalidationService],
})
export class CacheModule implements OnModuleInit {
  constructor(private readonly warmupService: CacheWarmupService) {}

  async onModuleInit() {
    // Warm cache on application boot
    await this.warmupService.warmCache();
  }
}

// ==================== 2. CACHE DECORATORS ====================
// src/cache/decorators/cacheable.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

export interface CacheableOptions {
  key?: string;
  ttl?: number; // in seconds
  prefix?: string;
}

export const Cacheable = (options: CacheableOptions = {}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, options.key || propertyKey)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL_METADATA, options.ttl || 3600)(target, propertyKey, descriptor);
    return descriptor;
  };
};

