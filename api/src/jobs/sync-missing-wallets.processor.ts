import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WalletService } from '../application/wallets/wallet.service';
import { ContractsService } from '../contracts/contracts.service';
import { User } from '../application/users/entities/user.entity';

interface SyncMissingWalletsJobData {
  batchSize?: number;
}

@Processor('wallet-queue')
export class SyncMissingWalletsProcessor extends WorkerHost {
  constructor(
    private walletService: WalletService,
    private contractsService: ContractsService,
  ) {
    super();
  }

  async process(job: Job<SyncMissingWalletsJobData>) {
    const batchSize = job.data.batchSize || 10;
    let processed = 0;
    let skipped = 0;

    console.log(`Starting wallet sync job (batch: ${batchSize})`);

    while (true) {
      const users = await this.getUsersNeedingWallet(batchSize);
      if (users.length === 0) break;
      const results = await Promise.allSettled(
        users.map((user) => this.createWalletForUser(user)),
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          processed++;
        } else {
          skipped++;
          console.error('Wallet creation failed:', result.reason);
        }
      }
    }

    console.log(
      `Wallet sync complete: ${processed} created, ${skipped} failed`,
    );
    return { processed, skipped };
  }

  private async getUsersNeedingWallet(limit: number): Promise<User[]> {
    return this.walletService.findUsersNeedingWallet(limit);
  }

  private async createWalletForUser(user: User): Promise<void> {
    const wallet = await this.walletService.createWallet(user);
    const needs = {
      // starknet: !wallet.starknet_address,
      base: !wallet.base_address,
      celo: !wallet.celo_address,
    };

    if (!Object.values(needs).some(Boolean)) {
      return;
    }

    const [baseAddr, celoAddr] = await Promise.all([
      // needs.starknet
      //   ? this.contractsService.createUserStarknet(user.username)
      //   : null,
      needs.base
        ? this.contractsService.createUserEvm('base', user.username)
        : null,
      needs.celo
        ? this.contractsService.createUserEvm('celo', user.username)
        : null,
    ]);

    await this.walletService.updateWalletAddresses(user.id, {
      // starknet: starknetAddr || wallet.starknet_address,
      base: baseAddr || wallet.base_address,
      celo: celoAddr || wallet.celo_address,
    });
  }
}
