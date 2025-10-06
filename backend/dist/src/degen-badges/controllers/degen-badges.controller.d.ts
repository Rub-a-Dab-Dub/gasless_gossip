import type { DegenBadgesService } from "../services/degen-badges.service";
import type { AwardBadgeDto, BatchAwardBadgeDto } from "../dto/award-badge.dto";
import { DegenBadgeResponseDto, DegenBadgeStatsDto } from "../dto/degen-badge-response.dto";
export declare class DegenBadgesController {
    private readonly degenBadgesService;
    constructor(degenBadgesService: DegenBadgesService);
    awardBadge(awardBadgeDto: AwardBadgeDto): Promise<DegenBadgeResponseDto>;
    batchAwardBadges(batchAwardDto: BatchAwardBadgeDto): Promise<DegenBadgeResponseDto[]>;
    getUserBadges(userId: string): Promise<DegenBadgeResponseDto[]>;
    getUserBadgeStats(userId: string): Promise<DegenBadgeStatsDto>;
}
