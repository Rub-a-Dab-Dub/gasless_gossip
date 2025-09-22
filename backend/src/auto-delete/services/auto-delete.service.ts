import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AutoDelete } from '../entities/auto-delete.entity';
import { Message } from '../../messages/message.entity';
import { SetAutoDeleteDto } from '../dto/set-auto-delete.dto';
import { StellarService } from '../../stellar/stellar.service';

@Injectable()
export class AutoDeleteService implements OnModuleInit {
  private readonly logger = new Logger(AutoDeleteService.name);
  private intervalHandle: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(AutoDelete)
    private readonly autoDeleteRepo: Repository<AutoDelete>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly stellarService: StellarService,
  ) {}

  onModuleInit() {
    // run every 15 seconds
    this.intervalHandle = setInterval(() => {
      this.processExpired().catch((e) =>
        this.logger.error('processExpired failed', e as Error),
      );
    }, 15000);
  }

  async setTimer(dto: SetAutoDeleteDto): Promise<AutoDelete> {
    const existingMessage = await this.messageRepo.findOne({
      where: { id: dto.messageId },
    });
    if (!existingMessage) throw new Error('Message not found');

    const expiry = dto.expiry
      ? new Date(dto.expiry)
      : new Date(Date.now() + (dto.seconds ?? 0) * 1000);

    let timer = await this.autoDeleteRepo.findOne({
      where: { messageId: dto.messageId },
    });
    if (!timer) {
      timer = this.autoDeleteRepo.create({
        messageId: dto.messageId,
        expiry,
      });
    } else {
      timer.expiry = expiry;
    }
    return this.autoDeleteRepo.save(timer);
  }

  async getTimer(messageId: string): Promise<AutoDelete | null> {
    return this.autoDeleteRepo.findOne({ where: { messageId } });
  }

  async processExpired(): Promise<void> {
    const now = new Date();
    const due = await this.autoDeleteRepo.find({
      where: { expiry: LessThan(now) },
      take: 100,
    });
    if (due.length === 0) return;

    for (const timer of due) {
      try {
        const msg = await this.messageRepo.findOne({
          where: { id: timer.messageId },
        });
        if (msg) {
          await this.messageRepo.delete({ id: msg.id });
          // Update Stellar to reflect deletion (mocked hash/tx)
          await this.stellarService.recordMessageDeletion(msg.id);
        }
        await this.autoDeleteRepo.delete({ id: timer.id });
      } catch (err) {
        this.logger.error('Failed to process timer', err as Error);
      }
    }
  }
}


