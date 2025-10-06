import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { AssignBadgeDto } from './dto/assign-badge.dto';
import { StellarService } from '../stellar/stellar.service';
export declare class BadgesService {
    private readonly badgeRepository;
    private readonly stellarService;
    constructor(badgeRepository: Repository<Badge>, stellarService: StellarService);
    assignBadge(dto: AssignBadgeDto): Promise<Badge>;
    getBadgesByUser(userId: number): Promise<Badge[]>;
}
