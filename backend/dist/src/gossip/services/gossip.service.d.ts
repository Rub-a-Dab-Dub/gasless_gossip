import { Repository } from 'typeorm';
import { GossipIntent } from '../entities/gossip-intent.entity';
import { GossipUpdate } from '../entities/gossip-update.entity';
import { CreateGossipIntentDto, UpdateGossipIntentDto, VoteGossipDto, CommentGossipDto, GossipIntentDto, GossipUpdateDto } from '../dto/gossip.dto';
export declare class GossipService {
    private readonly intentRepo;
    private readonly updateRepo;
    private readonly logger;
    constructor(intentRepo: Repository<GossipIntent>, updateRepo: Repository<GossipUpdate>);
    createIntent(dto: CreateGossipIntentDto, userId: string): Promise<GossipIntentDto>;
    updateIntentStatus(dto: UpdateGossipIntentDto, userId: string): Promise<GossipIntentDto>;
    voteIntent(dto: VoteGossipDto, userId: string): Promise<GossipIntentDto>;
    commentIntent(dto: CommentGossipDto, userId: string): Promise<GossipUpdateDto>;
    getIntentById(intentId: string): Promise<GossipIntentDto>;
    getIntentsByRoom(roomId: string, limit?: number): Promise<GossipIntentDto[]>;
    getUpdatesByIntent(intentId: string): Promise<GossipUpdateDto[]>;
    getRecentUpdates(roomId: string, limit?: number): Promise<GossipUpdateDto[]>;
    private createUpdate;
    private mapIntentToDto;
    private mapUpdateToDto;
    getPerformanceMetrics(): Promise<{
        totalIntents: number;
        totalUpdates: number;
        averageResponseTime: number;
        activeConnections: number;
    }>;
}
