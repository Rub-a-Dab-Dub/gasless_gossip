import { ConfigService } from '@nestjs/config';
export declare class StellarService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    executeRewardContract(userAddress: string, rewardAmount: number, roomId: string, predictionId: string): Promise<StellarReward>;
    calculateRewardAmount(confidence: number, totalVotes: number): number;
}
