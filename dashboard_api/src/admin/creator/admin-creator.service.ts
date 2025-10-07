import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { EvictionLog } from '../../rooms/entities/eviction-log.entity';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../../entities/transaction.entity';
import { Room, RoomType } from '../../../entities/room.entity';
import { Participant } from '../../../entities/participant.entity';
import { VoiceModerationQueueService } from '../../../rooms/services/voice-moderation-queue.service';
import { ethers } from 'ethers';

@Injectable()
export class AdminCreatorService {
  constructor(
    @InjectRepository(CreatorProfile) private readonly creatorRepo: Repository<CreatorProfile>,
    @InjectRepository(EvictionLog) private readonly evictionRepo: Repository<EvictionLog>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    @InjectRepository(Participant) private readonly participantRepo: Repository<Participant>,
    private readonly moderationQueue: VoiceModerationQueueService,
  ) {}

  async upgradeToCreator(userId: string, thresholds?: CreatorProfile['thresholds']): Promise<CreatorProfile> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isCreator = true;
    user.creatorStatus = 'pending';
    user.creatorSince = new Date();
    await this.userRepo.save(user);

    const existing = await this.creatorRepo.findOne({ where: { userId } });
    if (existing) {
      existing.status = 'pending';
      existing.thresholds = thresholds ?? existing.thresholds ?? {};
      return this.creatorRepo.save(existing);
    }

    const profile = this.creatorRepo.create({
      userId,
      status: 'pending',
      thresholds: thresholds ?? {},
      aggregates: { totalTips: 0, totalVisits: 0, totalEarnings: 0 },
    });
    return this.creatorRepo.save(profile);
  }

  async updateCreator(userId: string, updates: Partial<CreatorProfile>): Promise<CreatorProfile> {
    const profile = await this.creatorRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Creator profile not found');
    Object.assign(profile, updates);
    return this.creatorRepo.save(profile);
  }

  async approveCreator(userId: string): Promise<CreatorProfile> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.creatorRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Creator profile not found');
    user.creatorStatus = 'active';
    await this.userRepo.save(user);
    profile.status = 'active';
    profile.approvedAt = new Date();
    return this.creatorRepo.save(profile);
  }

  async downgradeCreator(userId: string): Promise<CreatorProfile> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.creatorRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Creator profile not found');
    user.creatorStatus = 'downgraded';
    await this.userRepo.save(user);
    profile.status = 'downgraded';
    profile.downgradedAt = new Date();
    return this.creatorRepo.save(profile);
  }

  async getCreatorAnalytics(userId: string, startDate?: string, endDate?: string): Promise<any> {
    const dateFilter = startDate && endDate ? Between(new Date(startDate), new Date(endDate)) : undefined;
    // Tips/earnings via transactions to creator
    const txWhere: any = { toUserId: userId };
    if (dateFilter) txWhere.createdAt = dateFilter;
    const transactions = await this.txRepo.find({ where: txWhere });
    const totalTips = transactions.reduce((sum, t) => sum + Number(t.amount ?? 0), 0);

    // Room visits: count participants joining creator's rooms in window
    const creatorRooms = await this.roomRepo.find({ where: { creatorId: userId } });
    const roomIds = creatorRooms.map(r => r.id);
    let totalVisits = 0;
    if (roomIds.length > 0) {
      // TypeORM doesn't support array IN with Between directly in this thin layer; do simple query per room
      const counts = await Promise.all(
        roomIds.map(async id => {
          const where: any = { roomId: id };
          if (dateFilter) where.joinedAt = dateFilter;
          return this.participantRepo.count({ where });
        })
      );
      totalVisits = counts.reduce((a, b) => a + b, 0);
    }

    // Access lists from profile
    const profile = await this.creatorRepo.findOne({ where: { userId } });
    return {
      totals: { tips: totalTips, visits: totalVisits },
      accessLists: profile?.accessLists ?? { allow: [], deny: [] },
    };
  }

  async logEviction(roomId: string, creatorId: string, evictedUserId: string, reason: string): Promise<EvictionLog> {
    const log = this.evictionRepo.create({ roomId, creatorId, evictedUserId, reason });
    return this.evictionRepo.save(log);
  }

  async listEvictionsByCreator(creatorId: string, startDate?: string, endDate?: string) {
    const where: any = { creatorId };
    if (startDate && endDate) where.createdAt = Between(new Date(startDate), new Date(endDate));
    return this.evictionRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  // Voice moderation queue
  getModerationQueueStatus() {
    return this.moderationQueue.getQueueStatus();
  }

  async submitVoiceForModeration(payload: { roomId: string; userId: string; voiceNoteUrl: string; content?: string; priority?: 'low'|'medium'|'high'; }) {
    const position = await this.moderationQueue.addToQueue({
      roomId: payload.roomId,
      userId: payload.userId,
      voiceNoteUrl: payload.voiceNoteUrl,
      content: payload.content,
      priority: payload.priority ?? 'medium',
    });
    return { position };
  }

  async processModerationItem(itemId: string, moderatorId: string, decision: 'approved' | 'rejected', reason?: string) {
    await this.moderationQueue.processItem(itemId, moderatorId, decision, reason);
    return { ok: true };
  }

  // ERC20 balance sync (basic ETH balance example; extend to token as needed)
  async syncWalletBalance(userId: string, rpcUrl: string) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['wallet'] as any });
    if (!user || !user.wallet?.address) throw new NotFoundException('Wallet not found for user');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balanceWei = await provider.getBalance(user.wallet.address);
    const balance = balanceWei.toString();
    user.wallet.balance = balance;
    user.wallet.lastSyncedAt = new Date();
    await (this.userRepo as any).manager.save(user.wallet);
    return { balance };
  }

  async evaluateCreatorStatus(userId: string, opts: { rpcUrl?: string } = {}) {
    const profile = await this.creatorRepo.findOne({ where: { userId } });
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['wallet'] as any });
    if (!profile || !user) throw new NotFoundException('Creator or user not found');

    // Sync wallet if rpc provided
    if (opts.rpcUrl) {
      try { await this.syncWalletBalance(userId, opts.rpcUrl); } catch {}
    }

    const thresholds = profile.thresholds || {};
    const analytics = await this.getCreatorAnalytics(userId);
    const currentBalance = BigInt(user.wallet?.balance ?? '0');
    const minBalance = thresholds.minBalance ? BigInt(thresholds.minBalance) : BigInt(0);
    const tipsOk = thresholds.minTips ? (analytics.totals.tips >= (thresholds.minTips || 0)) : true;
    const visitsOk = thresholds.minVisits ? (analytics.totals.visits >= (thresholds.minVisits || 0)) : true;
    const balanceOk = currentBalance >= minBalance;

    const shouldActivate = tipsOk && visitsOk && balanceOk;
    if (shouldActivate) {
      await this.approveCreator(userId);
    }
    return { shouldActivate, balanceOk, tipsOk, visitsOk, totals: analytics.totals };
  }
}


