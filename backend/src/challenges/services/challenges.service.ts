import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { ChallengeParticipation } from '../entities/challenge-participation.entity';
import { CreateChallengeDto } from '../dtos/create-challenge.dto';
import { JoinChallengeDto } from '../dtos/join-challenge.dto';
import { ConfigService } from '@nestjs/config';
import { StellarService } from '@/stellar/stellar.service';
import { UsersService } from '@/users/users.service';

export enum ChallengeStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export interface ChallengeRewardResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(ChallengeParticipation)
    private readonly participationRepository: Repository<ChallengeParticipation>,
    private readonly configService: ConfigService,
    private readonly stellarService: StellarService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new challenge
   */
  async createChallenge(dto: CreateChallengeDto): Promise<Challenge> {
    const challenge = this.challengeRepository.create({
      title: dto.title,
      goal: dto.goal,
      expiry: dto.expiry,
      reward: dto.reward,
    });

    return this.challengeRepository.save(challenge);
  }

  /**
   * Get all active challenges
   */
  async getChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.find({
      where: { expiry: () => 'expiry > NOW()' },
    });
  }

  /**
   * User joins a challenge
   */
  async joinChallenge(userId: string, dto: JoinChallengeDto): Promise<ChallengeParticipation> {
    const challenge = await this.challengeRepository.findOne({
      where: { id: dto.challengeId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge ${dto.challengeId} not found`);
    }

    const existing = await this.participationRepository.findOne({
      where: { userId, challenge: { id: dto.challengeId } },
      relations: ['challenge'],
    });

    if (existing) {
      throw new BadRequestException('User already joined this challenge');
    }

    const participation = this.participationRepository.create({
      userId,
      challenge,
      progress: 0,
      status: ChallengeStatus.ACTIVE,
    });

    return this.participationRepository.save(participation);
  }

  /**
   * Update progress on a challenge
   */
  async updateProgress(userId: string, challengeId: string, increment: number): Promise<ChallengeParticipation> {
    const participation = await this.participationRepository.findOne({
      where: { userId, challenge: { id: challengeId } },
      relations: ['challenge'],
    });

    if (!participation) {
      throw new NotFoundException('Participation not found');
    }

    if (participation.status !== ChallengeStatus.ACTIVE) {
      throw new BadRequestException('Challenge is not active');
    }

    participation.progress += increment;

    if (participation.progress >= participation.challenge.goal) {
      participation.status = ChallengeStatus.COMPLETED;
      participation.completedAt = new Date();

      // Process reward
      const rewardResult = await this.processReward(participation);

      if (!rewardResult.success) {
        this.logger.error(`Reward distribution failed: ${rewardResult.error}`);
        // Do not throw, allow participation to remain completed but log failure
      }
    }

    return this.participationRepository.save(participation);
  }

  /**
   * Process Stellar reward distribution for a completed challenge
   */
  private async processReward(participation: ChallengeParticipation): Promise<ChallengeRewardResult> {
    try {
      // Idempotency: skip if already rewarded
      if (participation.stellarTransactionId) {
        this.logger.log(
          `Reward already distributed for participation ${participation.id}: ${participation.stellarTransactionId}`,
        );
        return { success: true, transactionId: participation.stellarTransactionId };
      }

      // Lookup user’s Stellar public key
      const user = await this.usersService.findById(participation.userId);
      const userStellarPublicKey =
        user?.stellarPublicKey || user?.walletInfo?.stellarPublicKey;

      if (!userStellarPublicKey) {
        throw new Error(`User ${participation.userId} has no Stellar public key`);
      }

      // Distribute reward
      const rewardAmount = participation.challenge.reward || 0;
      const result = await this.stellarService.distributeReward(
        userStellarPublicKey,
        rewardAmount,
      );

      if (!result.success) {
        participation.rewardFailedReason = result.error || 'Unknown error';
        await this.participationRepository.save(participation);

        return { success: false, error: participation.rewardFailedReason };
      }

      participation.stellarTransactionId = result.txHash;
      await this.participationRepository.save(participation);

      this.logger.log(
        `Reward distributed for participation ${participation.id}: tx ${result.txHash}`,
      );

      return { success: true, transactionId: result.txHash };
    } catch (error: any) {
      this.logger.error(`processReward error: ${error.message}`);
      return { success: false, error: error.message || String(error) };
    }
  }
}
