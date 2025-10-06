import { ReferralsService } from './services/referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { GenerateCodeDto } from './dto/generate-code.dto';
export declare class ReferralsController {
    private readonly referralsService;
    constructor(referralsService: ReferralsService);
    createReferral(createReferralDto: CreateReferralDto): Promise<import("./entities/referral.entity").Referral>;
    generateReferralCode(generateCodeDto: GenerateCodeDto): Promise<{
        referralCode: string;
    }>;
    getReferralHistory(userId: string): Promise<import("./entities/referral.entity").Referral[]>;
    getReferralStats(userId: string): Promise<{
        totalReferrals: number;
        completedReferrals: number;
        pendingReferrals: number;
        totalRewards: number;
        referrals: import("./entities/referral.entity").Referral[];
    }>;
}
