import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { WalletBlacklist } from './entities/wallet-blacklist.entity';

@Injectable()
export class WalletBlacklistService {
  private readonly logger = new Logger(WalletBlacklistService.name);

  constructor(
    @InjectRepository(WalletBlacklist)
    private readonly blacklistRepo: Repository<WalletBlacklist>
  ) {}

  async addToBlacklist(
    walletAddress: string,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<WalletBlacklist> {
    // Validate wallet address format
    if (!ethers.isAddress(walletAddress)) {
      throw new Error('Invalid wallet address format');
    }

    const entry = this.blacklistRepo.create({
      walletAddress: walletAddress.toLowerCase(), // Normalize to lowercase
      reason,
      metadata,
      active: true,
    });

    return this.blacklistRepo.save(entry);
  }

  async removeFromBlacklist(walletAddress: string): Promise<void> {
    await this.blacklistRepo.update(
      { walletAddress: walletAddress.toLowerCase() },
      { active: false }
    );
  }

  async isBlacklisted(walletAddress: string): Promise<boolean> {
    const count = await this.blacklistRepo.count({
      where: {
        walletAddress: walletAddress.toLowerCase(),
        active: true,
      },
    });
    return count > 0;
  }

  async incrementDetection(walletAddress: string): Promise<void> {
    await this.blacklistRepo.update(
      { walletAddress: walletAddress.toLowerCase() },
      {
        detectionCount: () => '"detectionCount" + 1',
        lastDetectionAt: new Date(),
      }
    );
  }

  async exportBlacklist(): Promise<{
    walletAddress: string;
    reason: string;
    detectionCount: number;
  }[]> {
    const entries = await this.blacklistRepo.find({
      where: { active: true },
      select: ['walletAddress', 'reason', 'detectionCount'],
    });
    return entries;
  }

  async importBlacklist(entries: {
    walletAddress: string;
    reason: string;
    metadata?: Record<string, any>;
  }[]): Promise<{
    imported: number;
    failed: number;
    errors: { wallet: string; error: string }[];
  }> {
    const result = {
      imported: 0,
      failed: 0,
      errors: [] as { wallet: string; error: string }[],
    };

    for (const entry of entries) {
      try {
        if (!ethers.isAddress(entry.walletAddress)) {
          throw new Error('Invalid wallet address format');
        }

        await this.addToBlacklist(
          entry.walletAddress,
          entry.reason,
          entry.metadata
        );
        result.imported++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          wallet: entry.walletAddress,
          error: error.message,
        });
      }
    }

    return result;
  }

  async getBlacklistStats(): Promise<{
    totalWallets: number;
    activeWallets: number;
    totalDetections: number;
  }> {
    const [total, active, detections] = await Promise.all([
      this.blacklistRepo.count(),
      this.blacklistRepo.count({ where: { active: true } }),
      this.blacklistRepo
        .createQueryBuilder()
        .select('SUM(detection_count)', 'total')
        .getRawOne(),
    ]);

    return {
      totalWallets: total,
      activeWallets: active,
      totalDetections: parseInt(detections?.total || '0'),
    };
  }
}