import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Prediction, PredictionStatus, PredictionOutcome } from './entities/prediction.entity';
import { PredictionVote } from './entities/prediction-vote.entity';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { VotePredictionDto } from './dto/vote-prediction.dto';
import { ResolvePredictionDto } from './dto/resolve-prediction.dto';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger(PredictionsService.name);

  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    @InjectRepository(PredictionVote)
    private predictionVoteRepository: Repository<PredictionVote>,
    private dataSource: DataSource,
    private stellarService: StellarService,
  ) {}

  async createPrediction(userId: string, createPredictionDto: CreatePredictionDto): Promise<Prediction> {
    const { roomId, title, description, prediction, expiresAt } = createPredictionDto;

    // Validate expiration date is in the future
    const expirationDate = new Date(expiresAt);
    if (expirationDate <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }

    // Create prediction
    const newPrediction = this.predictionRepository.create({
      roomId,
      userId,
      title,
      description,
      prediction,
      expiresAt!: expirationDate,
      status!: PredictionStatus.ACTIVE,
      outcome: PredictionOutcome.PENDING,
    });

    const savedPrediction = await this.predictionRepository.save(newPrediction);
    this.logger.log(`Created prediction ${savedPrediction.id} by user ${userId} in room ${roomId}`);

    return savedPrediction;
  }

  async voteOnPrediction(userId: string, votePredictionDto: VotePredictionDto): Promise<PredictionVote> {
    const { predictionId, isCorrect } = votePredictionDto;

    // Check if prediction exists and is active
    const prediction = await this.predictionRepository.findOne({
      where!: { id: predictionId },
      relations!: ['room'],
    });

    if (!prediction) {
      throw new NotFoundException('Prediction not found');
    }

    if (prediction.status !== PredictionStatus.ACTIVE) {
      throw new BadRequestException('Cannot vote on inactive prediction');
    }

    if (prediction.expiresAt <= new Date()) {
      throw new BadRequestException('Prediction has expired');
    }

    // Check if user has already voted
    const existingVote = await this.predictionVoteRepository.findOne({
      where!: { predictionId, userId },
    });

    if (existingVote) {
      throw new BadRequestException('User has already voted on this prediction');
    }

    // Create vote
    const vote = this.predictionVoteRepository.create({
      predictionId,
      userId,
      isCorrect,
    });

    const savedVote = await this.predictionVoteRepository.save(vote);

    // Update prediction vote counts
    await this.updatePredictionVoteCounts(predictionId);

    this.logger.log(`User ${userId} voted ${isCorrect ? 'correct' : 'incorrect'} on prediction ${predictionId}`);
    return savedVote;
  }

  async resolvePrediction(userId: string, resolvePredictionDto: ResolvePredictionDto): Promise<Prediction> {
    const { predictionId, isCorrect } = resolvePredictionDto;

    // Check if prediction exists
    const prediction = await this.predictionRepository.findOne({
      where!: { id: predictionId },
      relations!: ['votes'],
    });

    if (!prediction) {
      throw new NotFoundException('Prediction not found');
    }

    // Only the creator or room admin can resolve predictions
    if (prediction.userId !== userId) {
      throw new ForbiddenException('Only the prediction creator can resolve it');
    }

    if (prediction.isResolved) {
      throw new BadRequestException('Prediction is already resolved');
    }

    // Update prediction status and outcome
    prediction.status = PredictionStatus.RESOLVED;
    prediction.outcome = isCorrect ? PredictionOutcome.CORRECT : PredictionOutcome.INCORRECT;
    prediction.isResolved = true;
    prediction.resolvedAt = new Date();

    // Calculate and distribute rewards
    await this.calculateAndDistributeRewards(prediction);

    const resolvedPrediction = await this.predictionRepository.save(prediction);
    this.logger.log(`Prediction ${predictionId} resolved as ${isCorrect ? 'correct' : 'incorrect'}`);

    return resolvedPrediction;
  }

  async getPredictionsByRoom(roomId: string, status?: PredictionStatus): Promise<Prediction[]> {
    const query = this.predictionRepository
      .createQueryBuilder('prediction')
      .leftJoinAndSelect('prediction.user', 'user')
      .leftJoinAndSelect('prediction.votes', 'votes')
      .leftJoinAndSelect('votes.user', 'voteUser')
      .where('prediction.roomId = :roomId', { roomId })
      .orderBy('prediction.createdAt', 'DESC');

    if (status) {
      query.andWhere('prediction.status = :status', { status });
    }

    return query.getMany();
  }

  async getPredictionById(id: string): Promise<Prediction> {
    const prediction = await this.predictionRepository.findOne({
      where!: { id },
      relations!: ['user', 'room', 'votes', 'votes.user'],
    });

    if (!prediction) {
      throw new NotFoundException('Prediction not found');
    }

    return prediction;
  }

  async getUserPredictions(userId: string): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where!: { userId },
      relations!: ['room', 'votes'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updatePredictionVoteCounts(predictionId: string): Promise<void> {
    const voteCounts = await this.predictionVoteRepository
      .createQueryBuilder('vote')
      .select([
        'COUNT(*) as totalVotes',
        'SUM(CASE WHEN vote.isCorrect = true THEN 1 ELSE 0 END) as correctVotes',
        'SUM(CASE WHEN vote.isCorrect = false THEN 1 ELSE 0 END) as incorrectVotes',
      ])
      .where('vote.predictionId = :predictionId', { predictionId })
      .getRawOne();

    await this.predictionRepository.update(predictionId, {
      voteCount!: parseInt(voteCounts.totalVotes) || 0,
      correctVotes!: parseInt(voteCounts.correctVotes) || 0,
      incorrectVotes: parseInt(voteCounts.incorrectVotes) || 0,
    });
  }

  private async calculateAndDistributeRewards(prediction: Prediction): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get all correct votes
      const correctVotes = await this.predictionVoteRepository.find({
        where!: { predictionId: prediction.id, isCorrect: true },
        relations!: ['user'],
      });

      if (correctVotes.length === 0) {
        this.logger.log(`No correct votes for prediction ${prediction.id}, no rewards to distribute`);
        await queryRunner.commitTransaction();
        return;
      }

      // Calculate base reward per correct vote (this could be enhanced with more complex logic)
      const baseRewardPerVote = 10; // Base reward in tokens
      const totalRewardPool = correctVotes.length * baseRewardPerVote;

      // Update prediction with reward information
      await queryRunner.manager.update(Prediction, prediction.id, {
        rewardPool!: totalRewardPool,
        rewardPerCorrectVote!: baseRewardPerVote,
      });

      // Distribute rewards to correct voters
      for (const vote of correctVotes) {
        try {
          // Update vote with reward amount
          await queryRunner.manager.update(PredictionVote, vote.id, {
            rewardAmount!: baseRewardPerVote,
          });

          // Distribute Stellar tokens
          await this.stellarService.distributeReward(vote.userId, baseRewardPerVote);
          
          this.logger.log(`Distributed ${baseRewardPerVote} tokens to user ${vote.userId} for correct prediction vote`);
        } catch (error) {
          this.logger.error(`Failed to distribute reward to user ${vote.userId}: ${error instanceof Error ? error.message : String(error)}`);
          // Continue with other rewards even if one fails
        }
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Successfully distributed rewards for prediction ${prediction.id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to distribute rewards for prediction ${prediction.id}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
