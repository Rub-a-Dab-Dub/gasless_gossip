import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitViolation } from './entities/rate-limit-violation.entity';
import { RateLimitService } from './services/rate-limit.service';
import { RateLimitController } from './rate-limit.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 60000, // 1 minute
          limit: configService.get('RATE_LIMIT_SHORT', 100), // 100 requests per minute
        },
        {
          name: 'medium',
          ttl: 300000, // 5 minutes
          limit: configService.get('RATE_LIMIT_MEDIUM', 500), // 500 requests per 5 minutes
        },
        {
          name: 'long',
          ttl: 3600000, // 1 hour
          limit: configService.get('RATE_LIMIT_LONG', 2000), // 2000 requests per hour
        },
      ],
    }),
    TypeOrmModule.forFeature([RateLimitViolation]),
  ],
  controllers: [RateLimitController],
  providers: [
    RateLimitService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [RateLimitService],
})
export class RateLimitingModule {}
