import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Challenge, ChallengeStatus, ChallengeType } from '../entities/challenge.entity';
import { ChallengeParticipation, ParticipationStatus } from '../entities/challenge-participation.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { JoinChallengeDto } from '../dto/join-challenge.dto';
import { ChallengeProgressUpdate, ChallengeCompletionResult, ChallengeRewardResult, ChallengeStats, UserChallengeProgress } from '../interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(ChallengeParticipation)
    private readonly participationRepository: Repository<ChallengeParticipation>,
    private readonly configService: ConfigService,
  ) {}

  async createChallenge(createChallengeDto: CreateChallengeDto, createdBy?: string): Promise<Challenge> {
    const { title, description, type, goal, reward, expiresAt, metadata } = createChallengeDto;

    // Validate expiration date
    const expiryDate = new Date(expiresAt);
    if (expiryDate <= new Date()) {
      throw new BadRequestException('Challenge expiration date must be in the future');
    }

    const challenge = this.challengeRepository.create({
      title,
      description,
      type,
      goal,
      reward,
      expiresAt: expiryDate,
      createdBy,
      metadata,
      status: ChallengeStatus.ACTIVE
    });

    const savedChallenge = await this.challengeRepository.save(challenge);
    
    this.logger.log(`Challenge created: ${title} (${type}) by ${createdBy || 'system'}`);
    
    return savedChallenge;
  }

  async getActiveChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.find({
      where: { 
        status: ChallengeStatus.ACTIVE,
        expiresAt: MoreThan(new Date())
      },
      order: { createdAt: 'DESC' }
    });
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async getChallengeById(challengeId: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOne({
      where: { id: challengeId }
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    return challenge;
  }

  async joinChallenge(userId: string, joinChallengeDto: JoinChallengeDto): Promise<ChallengeParticipation> {
    const { challengeId } = joinChallengeDto;

    const challenge = await this.getChallengeById(challengeId);

    // Check if challenge is still active
    if (challenge.status !== ChallengeStatus.ACTIVE || challenge.expiresAt <= new Date()) {
      throw new BadRequestException('Challenge is no longer active');
    }

    // Check if user already joined
    const existingParticipation = await this.participationRepository.findOne({
      where: { userId, challengeId }
    });

    if (existingParticipation) {
      throw new ConflictException('User has already joined this challenge');
    }

    const participation = this.participationRepository.create({
      userId,
      challengeId,
      status: ParticipationStatus.ACTIVE,
      progress: 0,
      rewardEarned: 0
    });

    const savedParticipation = await this.participationRepository.save(participation);

    // Update challenge participant count
    await this.challengeRepository.increment({ id: challengeId }, 'participantCount', 1);

    this.logger.log(`User ${userId} joined challenge: ${challenge.title}`);

    return savedParticipation;
  }

  async updateProgress(progressUpdate: ChallengeProgressUpdate): Promise<ChallengeCompletionResult> {
    const { userId, challengeId, progress, progressData } = progressUpdate;

    const participation = await this.participationRepository.findOne({
      where: { userId, challengeId },
      relations: ['challenge']
    });

    if (!participation) {
      throw new NotFoundException('Participation not found');
    }

    if (participation.status !== ParticipationStatus.ACTIVE) {
      throw new BadRequestException('Participation is not active');
    }

    // Update progress
    participation.progress = Math.min(progress, participation.challenge.goal);
    participation.progressData = progressData;

    // Check if challenge is completed
    if (participation.progress >= participation.challenge.goal) {
      return await this.completeChallenge(participation);
    }

    await this.participationRepository.save(participation);
    
    return {
      success: true,
      participationId: participation.id
    };
  }

  private async completeChallenge(participation: ChallengeParticipation): Promise<ChallengeCompletionResult> {
    try {
      // Mark participation as completed
      participation.status = ParticipationStatus.COMPLETED;
      participation.completedAt = new Date();
      participation.rewardEarned = participation.challenge.reward;

      await this.participationRepository.save(participation);

      // Update challenge completion count
      await this.challengeRepository.increment(
        { id: participation.challengeId }, 
        'completionCount', 
        1
      );

      // Process reward
      const rewardResult = await this.processReward(participation);
      
      if (rewardResult.success) {
        participation.stellarTransactionId = rewardResult.transactionId;
        await this.participationRepository.save(participation);
      }

      this.logger.log(`Challenge completed: ${participation.challenge.title} by user ${participation.userId}`);

      return {
        success: true,
        participationId: participation.id,
        rewardAmount: participation.rewardEarned,
        stellarTransactionId: rewardResult.transactionId
      };
    } catch (error) {
      this.logger.error(`Failed to complete challenge: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async processReward(participation: ChallengeParticipation): Promise<ChallengeRewardResult> {
    try {
      // In a real implementation, this would integrate with Stellar service
      // For now, we'll simulate the reward process
      
      const mockTransactionId = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.logger.log(`Processing reward: ${participation.rewardEarned} tokens for user ${participation.userId}`);
      
      // TODO: Integrate with actual Stellar service
      // const stellarService = this.moduleRef.get(StellarService);
      // const result = await stellarService.distributeReward(
      //   participation.userId,
      //   participation.rewardEarned
      // );

      return {
        success: true,
        transactionId: mockTransactionId
      };
    } catch (error) {
      this.logger.error(`Reward processing failed: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserChallenges(userId: string): Promise<UserChallengeProgress[]> {
    const participations = await this.participationRepository.find({
      where: { userId },
      relations: ['challenge'],
      order: { createdAt: 'DESC' }
    });

    return participations.map(participation => ({
      challengeId: participation.challengeId,
      challengeTitle: participation.challenge.title,
      progress: participation.progress,
      goal: participation.challenge.goal,
      status: participation.status,
      reward: participation.rewardEarned,
      expiresAt: participation.challenge.expiresAt
    }));
  }

  async getChallengeStats(): Promise<ChallengeStats> {
    const [totalChallenges, activeChallenges, completedChallenges] = await Promise.all([
      this.challengeRepository.count(),
      this.challengeRepository.count({ where: { status: ChallengeStatus.ACTIVE } }),
      this.challengeRepository.count({ where: { status: ChallengeStatus.COMPLETED } })
    ]);

    const totalRewardsEarned = await this.participationRepository
      .createQueryBuilder('participation')
      .select('SUM(participation.rewardEarned)', 'total')
      .where('participation.status = :status', { status: ParticipationStatus.COMPLETED })
      .getRawOne();

    const participationRate = totalChallenges > 0 
      ? (completedChallenges / totalChallenges) * 100 
      : 0;

    return {
      totalChallenges,
      activeChallenges,
      completedChallenges,
      totalRewardsEarned: parseFloat(totalRewardsEarned?.total || '0'),
      participationRate
    };
  }

  async expireChallenges(): Promise<void> {
    const expiredChallenges = await this.challengeRepository.find({
      where: {
        status: ChallengeStatus.ACTIVE,
        expiresAt: LessThan(new Date())
      }
    });

    for (const challenge of expiredChallenges) {
      challenge.status = ChallengeStatus.EXPIRED;
      await this.challengeRepository.save(challenge);
      
      this.logger.log(`Challenge expired: ${challenge.title}`);
    }
  }
}
