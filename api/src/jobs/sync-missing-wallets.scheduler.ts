import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WalletSyncScheduler implements OnModuleInit {
  constructor(@InjectQueue('wallet-queue') private walletQueue: Queue) {}

  onModuleInit() {
    this.scheduleSync();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async scheduleSync() {
    await this.walletQueue.add(
      'sync-missing-wallets',
      { batchSize: 15 },
      {
        priority: 1,
      },
    );
  }
}
