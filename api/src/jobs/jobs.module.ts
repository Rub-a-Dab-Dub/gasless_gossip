import { Module } from '@nestjs/common';
import { QueueModule } from '../infrastructure/queue/queue.module';
import { WalletModule } from '../application/wallets/wallet.module';
import { ContractsModule } from '../contracts/contracts.module';
import { CreateWalletProcessor } from './create-wallet.processor';
import { SyncMissingWalletsProcessor } from './sync-missing-wallets.processor';
import { WalletSyncScheduler } from './sync-missing-wallets.scheduler';

@Module({
  imports: [QueueModule, WalletModule, ContractsModule],
  providers: [
    CreateWalletProcessor,
    SyncMissingWalletsProcessor,
    WalletSyncScheduler,
  ],
})
export class JobsModule {}
