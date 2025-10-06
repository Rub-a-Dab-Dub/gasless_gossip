import { Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { ChallengeParticipation } from '../entities/challenge-participation.entity';
import { CreateChallengeDto } from '../dtos/create-challenge.dto';
import { JoinChallengeDto } from '../dtos/join-challenge.dto';
import { ConfigService } from '@nestjs/config';
import { StellarService } from '@/stellar/stellar.service';
import { UsersService } from '@/users/users.service';
export declare enum ChallengeStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    EXPIRED = "EXPIRED"
}
export interface ChallengeRewardResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}
export declare class ChallengesService {
    private readonly challengeRepository;
    private readonly participationRepository;
    private readonly configService;
    private readonly stellarService;
    private readonly usersService;
    private readonly logger;
    constructor(challengeRepository: Repository<Challenge>, participationRepository: Repository<ChallengeParticipation>, configService: ConfigService, stellarService: StellarService, usersService: UsersService);
    createChallenge(dto: CreateChallengeDto): Promise<Challenge>;
    getChallenges(): Promise<Challenge[]>;
    joinChallenge(userId: string, dto: JoinChallengeDto): Promise<ChallengeParticipation>;
    updateProgress(userId: string, challengeId: string, increment: number): Promise<ChallengeParticipation>;
    private processReward;
}
