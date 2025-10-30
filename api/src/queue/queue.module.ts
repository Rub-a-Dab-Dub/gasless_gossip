import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateWalletProcessor } from '../jobs/create-wallet.processor';
import { WalletModule } from '../wallets/wallet.module';
import { ContractsModule } from '../contracts/contracts.module';
import { SyncMissingWalletsProcessor } from '../jobs/sync-missing-wallets.processor';
import { WalletSyncScheduler } from '../jobs/sync-missing-wallets.scheduler';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const redisHost = configService.get<string>('REDIS_HOST', '127.0.0.1');
        const redisPort = Number(
          configService.get<string>('REDIS_PORT', '6379'),
        );
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '');

        // Prefer REDIS_URL if available (e.g., Railway or Upstash)
        if (redisUrl) {
          return {
            connection: {
              url: redisUrl,
            },
          };
        }

        // Fallback to host + port (local dev)
        return {
          connection: {
            host: redisHost,
            port: redisPort,
            password: redisPassword || undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'wallet-queue',
    }),
    WalletModule,
    ContractsModule,
  ],
  providers: [
    CreateWalletProcessor,
    SyncMissingWalletsProcessor,
    WalletSyncScheduler,
  ],
})
export class QueueModule {}
