import { BadgesService } from './badges.service';
import { AssignBadgeDto } from './dto/assign-badge.dto';
export declare class BadgesController {
    private readonly badgesService;
    constructor(badgesService: BadgesService);
    getBadges(userId: number): Promise<import("./entities/badge.entity").Badge[]>;
    assignBadge(dto: AssignBadgeDto): Promise<import("./entities/badge.entity").Badge>;
}
