import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { StellarService } from './stellar.service';
export declare class ReferralsService {
    private referralRepository;
    private stellarService;
    constructor(referralRepository: Repository<Referral>, stellarService: StellarService);
    generateReferralCode(userId: string): Promise<string>;
    private createReferralCode;
    createReferral(createReferralDto: CreateReferralDto): Promise<Referral>;
    private processReward;
    private getUserStellarPublicKey;
    findReferralsByUser(userId: string): Promise<Referral[]>;
    getReferralStats(userId: string): Promise<{
        totalReferrals: number;
        completedReferrals: number;
        pendingReferrals: number;
        totalRewards: number;
        referrals: Referral[];
    }>;
}
