import { Command, CommandRunner } from 'nest-commander';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Command({ name: 'wallet:sync-missing', description: 'Sync missing wallets' })
export class SyncWalletsCommand extends CommandRunner {
  constructor(@InjectQueue('wallet-queue') private walletQueue: Queue) {
    super();
  }

  async run(): Promise<void> {
    console.log('Starting missing wallet sync...');
    const job = await this.walletQueue.add('sync-missing-wallets', {
      batchSize: 20,
    });
    console.log(`Job ${job.id} queued`);
  }
}
