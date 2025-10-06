import type { Repository } from "typeorm";
import type { EventEmitter2 } from "@nestjs/event-emitter";
import { type DegenBadge, DegenBadgeType } from "../entities/degen-badge.entity";
import type { AwardBadgeDto, BatchAwardBadgeDto } from "../dto/award-badge.dto";
import type { DegenBadgeResponseDto, DegenBadgeStatsDto } from "../dto/degen-badge-response.dto";
import type { StellarBadgeService } from "./stellar-badge.service";
export declare class DegenBadgesService {
    private readonly degenBadgeRepository;
    private readonly stellarBadgeService;
    private readonly eventEmitter;
    private readonly logger;
    constructor(degenBadgeRepository: Repository<DegenBadge>, stellarBadgeService: StellarBadgeService, eventEmitter: EventEmitter2);
    awardBadge(awardBadgeDto: AwardBadgeDto): Promise<DegenBadgeResponseDto>;
    batchAwardBadges(batchAwardDto: BatchAwardBadgeDto): Promise<DegenBadgeResponseDto[]>;
    getUserBadges(userId: string): Promise<DegenBadgeResponseDto[]>;
    getUserBadgeStats(userId: string): Promise<DegenBadgeStatsDto>;
    checkBadgeEligibility(userId: string, badgeType: DegenBadgeType, userActivity: any): Promise<boolean>;
    private getBadgeConfiguration;
    private buildCriteria;
    private evaluateBadgeCriteria;
    private findRarestBadge;
    private mapToResponseDto;
}
