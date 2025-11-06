import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('queue.redis.url');
        const redisHost = configService.get<string>('queue.redis.host');
        const redisPort = configService.get<number>('queue.redis.port');
        const redisPassword = configService.get<string>('queue.redis.password');

        // Prefer REDIS_URL if available (e.g., Railway or Upstash)
        if (redisUrl) {
          return {
            connection: {
              url: redisUrl,
            },
          };
        }

        // Fallback to host + port (local dev with Docker)
        return {
          connection: {
            host: redisHost,
            port: redisPort,
            password: redisPassword,
          },
        };
      },
      inject: [ConfigService],
    }),
    // Register the wallet queue globally
    BullModule.registerQueue({
      name: 'wallet-queue',
    }),
  ],
  providers: [QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
