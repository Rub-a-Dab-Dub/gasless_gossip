import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Xp } from './xp.entity';
import { ProcessedEvent } from './processed-event.entity';
import { StellarAccount } from './stellar-account.entity';

@Injectable()
export class XpService {
  private readonly logger = new Logger(XpService.name);

  constructor(
    @InjectRepository(Xp)
    private readonly xpRepo: Repository<Xp>,
    @InjectRepository(ProcessedEvent)
    private readonly processedRepo: Repository<ProcessedEvent>,
    @InjectRepository(StellarAccount)
    private readonly stellarAccountRepo: Repository<StellarAccount>,
    private readonly dataSource: DataSource,
  ) {}

  async getXpForUser(userId: string): Promise<number> {
    const xpRow = await this.xpRepo.findOne({ where: { userId } });
    return xpRow ? xpRow.xpValue : 0;
  }

  async addXp(userId: string, amount: number, source?: string) {
    if (amount <= 0) return; // ignore non-positive

    let xpRow = await this.xpRepo.findOne({ where: { userId } });
    if (!xpRow) {
      xpRow = this.xpRepo.create({ userId, xpValue: amount });
    } else {
      xpRow.xpValue += amount;
    }

    await this.xpRepo.save(xpRow);
    this.logger.log(`Added ${amount} XP to ${userId} (source=${source})`);
    return xpRow;
  }

  // Example: process a Stellar event payload to award XP
  async processStellarEvent(event: {
    type: string;
    userId: string;
    data?: any;
  }) {
    // Basic mapping; could be expanded in repo notes
    const mapping = {
      message: 5,
      token_send: 10,
    } as Record<string, number>;

    const amount = mapping[event.type] ?? 0;
    if (amount > 0) {
      return this.addXp(event.userId, amount, event.type);
    }
    return null;
  }

  // idempotent handler for incoming Stellar events (uses eventId dedup)
  async handleEvent(event: {
    eventId: string;
    type: string;
    userId: string;
    data?: any;
  }) {
    // transactional approach: insert processed_event, if exists -> skip
    return this.dataSource.transaction(async (manager) => {
      const processed = await manager.findOne(ProcessedEvent, {
        where: { eventId: event.eventId },
      });
      if (processed) return null; // already handled

      await manager.save(ProcessedEvent, {
        eventId: event.eventId,
        source: event.type,
      });

      const mapping = { message: 5, token_send: 10 } as Record<string, number>;
      const amount = mapping[event.type] ?? 0;
      if (amount > 0) {
        // Resolve Stellar account address to internal userId if mapping exists
        let resolvedUserId = event.userId;
        try {
          const mappingRow = await this.stellarAccountRepo.findOne({
            where: { stellarAccount: event.userId },
          });
          if (mappingRow && mappingRow.userId)
            resolvedUserId = mappingRow.userId;
        } catch (e) {
          // non-fatal; if repo not available in this runtime, fallback to raw userId
          this.logger.debug('StellarAccount lookup failed, using raw userId');
        }

        let xpRow = await manager.findOne(Xp, {
          where: { userId: resolvedUserId },
        });
        if (!xpRow) {
          xpRow = manager.create(Xp, {
            userId: resolvedUserId,
            xpValue: amount,
          });
          const saved = await manager.save(Xp, xpRow);
          if (saved && !saved.userId) (saved as any).userId = resolvedUserId;
          return saved;
        } else {
          xpRow.xpValue += amount;
          const saved = await manager.save(Xp, xpRow);
          if (saved && !saved.userId) (saved as any).userId = resolvedUserId;
          return saved;
        }
      }
      return null;
    });
  }
}
