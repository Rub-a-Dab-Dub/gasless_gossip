import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StarknetService } from '../contracts/starknet.service';

interface AuthRequest extends Request {
  user: User;
}

@Controller('wallet')
export class WalletController {
  constructor(
    private walletService: WalletService,
    @InjectQueue('wallet-queue') private walletQueue: Queue,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyWallet(@Request() req: AuthRequest) {
    const userId = req.user.id;
    console.log(req.user);
    const wallet = await this.walletService.getWalletByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    return {
      wallet: {
        id: wallet.id,
        celo_address: wallet.celo_address,
        base_address: wallet.base_address,
        starknet_address: wallet.starknet_address,
        celo_balance: wallet.celo_balance,
        base_balance: wallet.base_balance,
        starknet_balance: wallet.starknet_balance,
        created_at: wallet.created_at,
      },
    };
  }

  @Get('username/:username')
  async getWalletByUsername(@Param('username') username: string) {
    const user = await this.walletService.getUserByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    const wallet = await this.walletService.getWalletByUserId(user.id);
    if (!wallet) throw new NotFoundException('Wallet not created yet');

    return {
      wallet: {
        celo_address: wallet.celo_address,
        base_address: wallet.base_address,
        starknet_address: wallet.starknet_address,
        celo_balance: wallet.celo_balance,
        base_balance: wallet.base_balance,
        starknet_balance: wallet.starknet_balance,
      },
    };
  }

  @Post('sync-missing')
  @UseGuards(JwtAuthGuard)
  async triggerWalletSync(@Body('batchSize') batchSize = 10) {
    const job = await this.walletQueue.add(
      'sync-missing-wallets',
      { batchSize },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      },
    );
    return { jobId: job.id, message: 'Wallet sync started' };
  }
}
