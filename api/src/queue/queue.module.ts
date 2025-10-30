import { BullModule } from '@nestjs/bull';
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
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPortStr = configService.get<string>('REDIS_PORT');
        const redisPort = Number(redisPortStr);

        if (isNaN(redisPort) || redisPort < 0 || redisPort > 65535) {
          throw new Error(
            `Invalid REDIS_PORT: ${redisPortStr}. Must be a number between 0 and 65535.`,
          );
        }

        if (redisUrl) {
          return { redis: redisUrl };
        }

        return {
          redis: {
            host: redisHost,
            port: redisPort,
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
