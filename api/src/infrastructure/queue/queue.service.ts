import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('wallet-queue') private readonly walletQueue: Queue,
  ) {}

  /**
   * Get the wallet queue instance
   * This allows other modules to interact with the queue without direct BullMQ dependencies
   */
  getWalletQueue(): Queue {
    return this.walletQueue;
  }

  /**
   * Add a job to create a wallet
   */
  async addCreateWalletJob(data: { userId: string; username: string }) {
    return this.walletQueue.add('create-wallet', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  /**
   * Add a job to sync missing wallets
   */
  async addSyncMissingWalletsJob() {
    return this.walletQueue.add(
      'sync-missing-wallets',
      {},
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.walletQueue.getWaitingCount(),
      this.walletQueue.getActiveCount(),
      this.walletQueue.getCompletedCount(),
      this.walletQueue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      total: waiting + active + completed + failed,
    };
  }

  /**
   * Clear all jobs from the queue
   */
  async clearQueue() {
    await this.walletQueue.drain();
    await this.walletQueue.clean(0, 1000, 'completed');
    await this.walletQueue.clean(0, 1000, 'failed');
  }
}
