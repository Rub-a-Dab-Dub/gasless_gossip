import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Hook, EventType } from '../entities/hook.entity';

@Injectable()
export class HookRepository {
  constructor(
    @InjectRepository(Hook)
    private readonly hookRepository: Repository<Hook>,
  ) {}

  async create(hookData: Partial<Hook>): Promise<Hook> {
    const hook = this.hookRepository.create(hookData);
    return await this.hookRepository.save(hook);
  }

  async findById(id: string): Promise<Hook | null> {
    return await this.hookRepository.findOne({ where: { id } });
  }

  async findByTransactionId(transactionId: string): Promise<Hook | null> {
    return await this.hookRepository.findOne({
      where: { stellarTransactionId: transactionId }
    });
  }

  async findUnprocessed(): Promise<Hook[]> {
    return await this.hookRepository.find({
      where: { processed: false },
      order: { createdAt: 'ASC' }
    });
  }

  async findByEventType(eventType: EventType, limit = 100): Promise<Hook[]> {
    return await this.hookRepository.find({
      where: { eventType },
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async markAsProcessed(id: string, errorMessage?: string): Promise<void> {
    await this.hookRepository.update(id, {
      processed: true,
      processedAt: new Date(),
      errorMessage
    });
  }

  async findRecent(limit = 50): Promise<Hook[]> {
    return await this.hookRepository.find({
      order: { createdAt: 'DESC' },
      take: limit
    });
  }
}