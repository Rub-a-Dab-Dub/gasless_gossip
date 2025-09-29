import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GossipIntent } from '../entities/gossip-intent.entity';
import { GossipUpdate } from '../entities/gossip-update.entity';
import { 
  CreateGossipIntentDto, 
  UpdateGossipIntentDto, 
  VoteGossipDto, 
  CommentGossipDto,
  GossipIntentDto,
  GossipUpdateDto,
  GossipBroadcastDto
} from '../dto/gossip.dto';

@Injectable()
export class GossipService {
  private readonly logger = new Logger(GossipService.name);

  constructor(
    @InjectRepository(GossipIntent)
    private readonly intentRepo: Repository<GossipIntent>,
    @InjectRepository(GossipUpdate)
    private readonly updateRepo: Repository<GossipUpdate>,
  ) {}

  async createIntent(dto: CreateGossipIntentDto, userId: string): Promise<GossipIntentDto> {
    const expiresAt = dto.expiresInMinutes 
      ? new Date(Date.now() + dto.expiresInMinutes * 60 * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // Default 24 hours

    const intent = this.intentRepo.create({
      roomId: dto.roomId,
      userId,
      content: dto.content,
      metadata: dto.metadata,
      expiresAt,
    });

    const savedIntent = await this.intentRepo.save(intent);

    // Create update record
    await this.createUpdate({
      intentId: savedIntent.id,
      userId,
      type: 'new_intent',
      content: dto.content,
    });

    return this.mapIntentToDto(savedIntent);
  }

  async updateIntentStatus(dto: UpdateGossipIntentDto, userId: string): Promise<GossipIntentDto> {
    const intent = await this.intentRepo.findOne({ where: { id: dto.intentId } });
    if (!intent) {
      throw new NotFoundException('Gossip intent not found');
    }

    intent.status = dto.status;
    const updatedIntent = await this.intentRepo.save(intent);

    // Create update record
    await this.createUpdate({
      intentId: intent.id,
      userId,
      type: 'status_change',
      content: dto.reason,
      metadata: { oldStatus: intent.status, newStatus: dto.status },
    });

    return this.mapIntentToDto(updatedIntent);
  }

  async voteIntent(dto: VoteGossipDto, userId: string): Promise<GossipIntentDto> {
    const intent = await this.intentRepo.findOne({ where: { id: dto.intentId } });
    if (!intent) {
      throw new NotFoundException('Gossip intent not found');
    }

    // Update vote counts
    if (dto.action === 'upvote') {
      intent.upvotes += 1;
    } else if (dto.action === 'downvote') {
      intent.downvotes += 1;
    } else if (dto.action === 'remove') {
      // This would require tracking individual votes, simplified for now
      intent.upvotes = Math.max(0, intent.upvotes - 1);
    }

    const updatedIntent = await this.intentRepo.save(intent);

    // Create update record
    await this.createUpdate({
      intentId: intent.id,
      userId,
      type: 'vote',
      content: dto.action,
    });

    return this.mapIntentToDto(updatedIntent);
  }

  async commentIntent(dto: CommentGossipDto, userId: string): Promise<GossipUpdateDto> {
    const intent = await this.intentRepo.findOne({ where: { id: dto.intentId } });
    if (!intent) {
      throw new NotFoundException('Gossip intent not found');
    }

    const update = await this.createUpdate({
      intentId: dto.intentId,
      userId,
      type: 'comment',
      content: dto.content,
    });

    return this.mapUpdateToDto(update);
  }

  async getIntentById(intentId: string): Promise<GossipIntentDto> {
    const intent = await this.intentRepo.findOne({ where: { id: intentId } });
    if (!intent) {
      throw new NotFoundException('Gossip intent not found');
    }

    return this.mapIntentToDto(intent);
  }

  async getIntentsByRoom(roomId: string, limit: number = 50): Promise<GossipIntentDto[]> {
    const intents = await this.intentRepo.find({
      where: { roomId },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return intents.map(intent => this.mapIntentToDto(intent));
  }

  async getUpdatesByIntent(intentId: string): Promise<GossipUpdateDto[]> {
    const updates = await this.updateRepo.find({
      where: { intentId },
      order: { createdAt: 'ASC' },
    });

    return updates.map(update => this.mapUpdateToDto(update));
  }

  async getRecentUpdates(roomId: string, limit: number = 20): Promise<GossipUpdateDto[]> {
    const updates = await this.updateRepo
      .createQueryBuilder('update')
      .leftJoin('update.intent', 'intent')
      .where('intent.roomId = :roomId', { roomId })
      .orderBy('update.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return updates.map(update => this.mapUpdateToDto(update));
  }

  private async createUpdate(data: {
    intentId: string;
    userId: string;
    type: 'new_intent' | 'status_change' | 'vote' | 'comment' | 'verification';
    content?: string;
    metadata?: Record<string, any>;
  }): Promise<GossipUpdate> {
    const update = this.updateRepo.create(data);
    return this.updateRepo.save(update);
  }

  private mapIntentToDto(intent: GossipIntent): GossipIntentDto {
    return {
      id: intent.id,
      roomId: intent.roomId,
      userId: intent.userId,
      content: intent.content,
      status: intent.status,
      metadata: intent.metadata,
      upvotes: intent.upvotes,
      downvotes: intent.downvotes,
      expiresAt: intent.expiresAt,
      createdAt: intent.createdAt,
      updatedAt: intent.updatedAt,
    };
  }

  private mapUpdateToDto(update: GossipUpdate): GossipUpdateDto {
    return {
      id: update.id,
      intentId: update.intentId,
      userId: update.userId,
      type: update.type,
      content: update.content,
      metadata: update.metadata,
      createdAt: update.createdAt,
    };
  }

  // Performance monitoring
  async getPerformanceMetrics(): Promise<{
    totalIntents: number;
    totalUpdates: number;
    averageResponseTime: number;
    activeConnections: number;
  }> {
    const [totalIntents, totalUpdates] = await Promise.all([
      this.intentRepo.count(),
      this.updateRepo.count(),
    ]);

    return {
      totalIntents,
      totalUpdates,
      averageResponseTime: 0, // Would be tracked in real implementation
      activeConnections: 0, // Would be tracked by gateway
    };
  }
}
