import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createWallet(user: User): Promise<Wallet> {
    const user_wallet = await this.getWalletByUserId(user.id);
    if (user_wallet) return user_wallet;
    const wallet = this.walletRepo.create({ user });
    return await this.walletRepo.save(wallet);
  }

  async updateWalletAddresses(
    userId: number,
    addresses: {
      starknet?: string | null;
      base?: string | null;
      celo?: string | null;
    },
  ) {
    await this.walletRepo.update(
      { user: { id: userId } },
      {
        ...(addresses.starknet && { starknet_address: addresses.starknet }),
        ...(addresses.base && { base_address: addresses.base }),
        ...(addresses.celo && { celo_address: addresses.celo }),
      },
    );
  }

  async updateWalletBalance(
    userId: number,
    chain: 'starknet' | 'base' | 'celo',
    balance: string,
  ) {
    const field = `${chain}_balance`;
    await this.walletRepo.update(
      { user: { id: userId } },
      { [field]: balance },
    );
  }

  async getWalletByUserId(userId: number): Promise<Wallet | null> {
    return this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async findUsersNeedingWallet(limit: number): Promise<User[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where(
        `wallet.id IS NULL OR 
       wallet.starknet_address IS NULL OR 
       wallet.base_address IS NULL OR 
       wallet.celo_address IS NULL`,
      )
      .limit(limit)
      .getMany();
  }

  async findVerifiedUsersWithoutWallet(): Promise<User[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where('user.is_verified = :verified', { verified: true })
      .andWhere('wallet.id IS NULL')
      .getMany();
  }

  async createWalletsForVerifiedUsers(): Promise<{
    processed: number;
    created: number;
    failed: number;
    errors: Array<{ userId: number; username: string; error: string }>;
  }> {
    const users = await this.findVerifiedUsersWithoutWallet();
    let created = 0;
    let failed = 0;
    const errors: Array<{ userId: number; username: string; error: string }> =
      [];

    for (const user of users) {
      try {
        await this.createWallet(user);
        created++;
      } catch (error) {
        failed++;
        errors.push({
          userId: user.id,
          username: user.username,
          error: error.message || 'Unknown error',
        });
      }
    }

    return {
      processed: users.length,
      created,
      failed,
      errors,
    };
  }
}
