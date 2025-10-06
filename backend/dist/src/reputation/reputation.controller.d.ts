import { ReputationService } from './reputation.service';
import { UpdateReputationDto } from './dto/update-reputation.dto';
export declare class ReputationController {
    private readonly reputationService;
    constructor(reputationService: ReputationService);
    getReputation(userId: string): Promise<import("./entities/reputation.entity").Reputation | null>;
    updateReputation(dto: UpdateReputationDto): Promise<import("./entities/reputation.entity").Reputation>;
    calculateReputation(userId: string): Promise<import("./entities/reputation.entity").Reputation>;
}
