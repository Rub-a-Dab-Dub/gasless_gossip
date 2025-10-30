import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WalletService } from '../wallets/wallet.service';
import { ContractsService } from '../contracts/contracts.service';
import { User } from '../users/entities/user.entity';

interface CreateWalletJobData {
  user: User;
}

@Processor('wallet-queue')
export class CreateWalletProcessor extends WorkerHost {
  constructor(
    private walletService: WalletService,
    private contractsService: ContractsService,
  ) {
    super();
  }

  async process(job: Job<CreateWalletJobData>) {
    const { user } = job.data;

    try {
      const wallet = await this.walletService.createWallet(user);
      // const [starknetAddr, baseAddr, celoAddr] = await Promise.all([
      //   this.contractsService.createUserStarknet(user.username),
      //   this.contractsService.createUserEvm('base', user.username),
      //   this.contractsService.createUserEvm('celo', user.username),
      // ]);
      // await this.walletService.updateWalletAddresses(user.id, {
      //   starknet: starknetAddr,
      //   base: baseAddr,
      //   celo: celoAddr,
      // });
      const [baseAddr, celoAddr] = await Promise.all([
        this.contractsService.createUserEvm('base', user.username),
        this.contractsService.createUserEvm('celo', user.username),
      ]);
      await this.walletService.updateWalletAddresses(user.id, {
        base: baseAddr,
        celo: celoAddr,
      });

      console.log(`Wallet created for ${user.username}`);
    } catch (error) {
      console.error(`Wallet creation failed for ${user.username}`, error);
      throw error;
    }
  }
}
