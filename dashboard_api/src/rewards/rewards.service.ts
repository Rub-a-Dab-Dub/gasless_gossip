import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { RewardConfig } from './entities/reward-config.entity';
import { RewardExecution } from './entities/reward-execution.entity';
import { CreateRewardConfigDto } from './dto/create-reward-config.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(
    @InjectRepository(RewardConfig)
    private configRepo: Repository<RewardConfig>,
    @InjectRepository(RewardExecution)
    private executionRepo: Repository<RewardExecution>,
    private schedulerRegistry: SchedulerRegistry,
    private blockchainService: BlockchainService,
    private leaderboardService: LeaderboardService,
  ) {}

  // ==================== CREATE ====================
  async create(dto: CreateRewardConfigDto): Promise<RewardConfig> {
    const config = this.configRepo.create(dto);
    const saved = await this.configRepo.save(config);
    
    // Register dynamic cron job
    this.registerCronJob(saved);
    
    this.logger.log(`Created reward config: ${saved.id}`);
    return saved;
  }

  // ==================== READ (Select Winners) ====================
  async selectWinners(configId: string): Promise<{
    config: RewardConfig;
    winners: Array<{ userId: string; address: string; score: number }>;
  }> {
    const config = await this.configRepo.findOne({ where: { id: configId } });
    if (!config) throw new NotFoundException('Config not found');

    // Get top performers from leaderboard
    const topUsers = await this.leaderboardService.getTopUsers(
      config.topWinnersCount * 2, // Get extra in case of ties
    );

    // Apply eligibility criteria
    const eligible = topUsers.filter(user => 
      this.checkEligibility(user, config.eligibilityCriteria)
    );

    // Handle ties with random selection
    const winners = this.selectWithTiebreak(eligible, config.topWinnersCount);

    // Apply value cap
    const cappedWinners = winners.map(w => ({
      ...w,
      rewardAmount: Math.min(config.rewardAmount, config.maxValueCap),
    }));

    this.logger.log(`Selected ${cappedWinners.length} winners for config ${configId}`);
    return { config, winners: cappedWinners };
  }

  // ==================== UPDATE (Execute Transaction) ====================
  async executeRewardDrop(configId: string): Promise<RewardExecution> {
    const { config, winners } = await this.selectWinners(configId);

    // Create execution record
    const execution = this.executionRepo.create({
      configId,
      winners,
      status: 'pending',
      totalDistributed: 0,
    });
    await this.executionRepo.save(execution);

    try {
      execution.status = 'processing';
      await this.executionRepo.save(execution);

      // Execute on-chain transaction
      const txHash = await this.blockchainService.batchTransfer(
        config.tokenAddress,
        winners.map(w => ({
          address: w.address,
          amount: config.rewardAmount,
        })),
      );

      // Update execution with success
      execution.transactionHash = txHash;
      execution.status = 'completed';
      execution.totalDistributed = config.rewardAmount * winners.length;
      await this.executionRepo.save(execution);

      this.logger.log(`Reward drop executed: ${txHash}`);
      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.errorMessage = error.message;
      await this.executionRepo.save(execution);
      
      this.logger.error(`Reward drop failed: ${error.message}`);
      throw error;
    }
  }

  // ==================== DELETE (Confirm/View Logs) ====================
  async getExecutionLogs(configId?: string): Promise<RewardExecution[]> {
    const query: any = {};
    if (configId) query.configId = configId;

    return this.executionRepo.find({
      where: query,
      order: { executedAt: 'DESC' },
      take: 100,
    });
  }

  async confirmExecution(executionId: string): Promise<RewardExecution> {
    const execution = await this.executionRepo.findOne({ 
      where: { id: executionId } 
    });
    
    if (!execution) throw new NotFoundException('Execution not found');

    // Verify on-chain transaction
    const verified = await this.blockchainService.verifyTransaction(
      execution.transactionHash,
    );

    if (verified) {
      this.logger.log(`Execution ${executionId} confirmed on-chain`);
    }

    return execution;
  }

  async deleteConfig(id: string): Promise<void> {
    const config = await this.configRepo.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Config not found');

    // Remove cron job
    try {
      this.schedulerRegistry.deleteCronJob(`reward-${id}`);
    } catch (e) {
      // Job might not exist
    }

    await this.configRepo.remove(config);
    this.logger.log(`Deleted reward config: ${id}`);
  }

  // ==================== SCHEDULER ====================
  @Cron('0 0 * * 0') // Default: Every Sunday at midnight
  async runWeeklyCron() {
    const configs = await this.configRepo.find({
      where: { isActive: true, frequency: DropFrequency.WEEKLY },
    });

    for (const config of configs) {
      try {
        await this.executeRewardDrop(config.id);
      } catch (error) {
        this.logger.error(`Failed to execute reward for ${config.id}: ${error.message}`);
      }
    }
  }

  private registerCronJob(config: RewardConfig) {
    const job = new CronJob(config.cronExpression, async () => {
      this.logger.log(`Running scheduled drop for config: ${config.id}`);
      await this.executeRewardDrop(config.id);
    });

    this.schedulerRegistry.addCronJob(`reward-${config.id}`, job);
    job.start();
  }

  // ==================== HELPERS ====================
  private selectWithTiebreak(
    users: Array<{ userId: string; address: string; score: number }>,
    count: number,
  ): Array<{ userId: string; address: string; score: number }> {
    if (users.length <= count) return users;

    const sorted = [...users].sort((a, b) => b.score - a.score);
    const cutoffScore = sorted[count - 1].score;

    // Find all users with cutoff score
    const tied = sorted.filter(u => u.score === cutoffScore);
    const notTied = sorted.filter(u => u.score > cutoffScore);

    if (notTied.length >= count) {
      return notTied.slice(0, count);
    }

    // Random tiebreak
    const spotsLeft = count - notTied.length;
    const shuffled = tied.sort(() => Math.random() - 0.5);
    
    return [...notTied, ...shuffled.slice(0, spotsLeft)];
  }

  private checkEligibility(
    user: any,
    criteria: string[],
  ): boolean {
    if (!criteria || criteria.length === 0) return true;
    
    // Example criteria checks
    for (const criterion of criteria) {
      if (criterion === 'verified' && !user.isVerified) return false;
      if (criterion === 'kyc' && !user.hasKyc) return false;
    }
    
    return true;
  }
}