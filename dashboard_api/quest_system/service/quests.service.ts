import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Quest, QuestStatus, QuestType } from './entities/quest.entity';
import { UserQuestProgress } from './entities/user-quest-progress.entity';
import { QuestAudit } from './entities/quest-audit.entity';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QuestsService {
  private readonly logger = new Logger(QuestsService.name);

  constructor(
    @InjectRepository(Quest)
    private questRepository: Repository<Quest>,
    @InjectRepository(UserQuestProgress)
    private progressRepository: Repository<UserQuestProgress>,
    @InjectRepository(QuestAudit)
    private auditRepository: Repository<QuestAudit>,
    private dataSource: DataSource,
  ) {}

  // ==================== ADMIN: CRUD ====================

  async create(createQuestDto: CreateQuestDto): Promise<Quest> {
    const quest = this.questRepository.create(createQuestDto);
    return this.questRepository.save(quest);
  }

  async findAll(): Promise<Quest[]> {
    return this.questRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Quest> {
    const quest = await this.questRepository.findOne({ where: { id } });
    if (!quest) {
      throw new NotFoundException(`Quest ${id} not found`);
    }
    return quest;
  }

  async update(id: string, updateQuestDto: UpdateQuestDto): Promise<Quest> {
    const quest = await this.findOne(id);
    
    // Prevent editing critical fields if quest has active users
    if (updateQuestDto.requiredCount && quest.status === QuestStatus.ACTIVE) {
      const activeUsers = await this.progressRepository.count({
        where: { questId: id, completed: false }
      });
      
      if (activeUsers > 0) {
        throw new BadRequestException('Cannot change requirements while users are actively progressing');
      }
    }

    Object.assign(quest, updateQuestDto);
    return this.questRepository.save(quest);
  }

  async remove(id: string): Promise<void> {
    const quest = await this.findOne(id);
    quest.status = QuestStatus.ENDED;
    quest.endsAt = new Date();
    await this.questRepository.save(quest);
    this.logger.log(`Quest ${id} ended prematurely`);
  }

  async toggleFrenzy(id: string, active: boolean): Promise<Quest> {
    const quest = await this.findOne(id);
    quest.isFrenzyActive = active;
    await this.questRepository.save(quest);
    this.logger.log(`Frenzy ${active ? 'activated' : 'deactivated'} for quest ${id}`);
    return quest;
  }

  // ==================== USER: PROGRESS ====================

  async getUserProgress(userId: string, questId: string): Promise<UserQuestProgress | null> {
    const quest = await this.findOne(questId);
    const periodDate = this.getCurrentPeriodDate(quest.type);

    return this.progressRepository.findOne({
      where: { userId, questId, periodDate },
      relations: ['quest']
    });
  }

  async incrementProgress(
    userId: string,
    questId: string,
    increment: number,
    ipAddress?: string
  ): Promise<{ progress: UserQuestProgress; completed: boolean; rewards?: any }> {
    const quest = await this.findOne(questId);

    if (quest.status !== QuestStatus.ACTIVE) {
      throw new BadRequestException('Quest is not active');
    }

    if (quest.endsAt && new Date() > quest.endsAt) {
      throw new BadRequestException('Quest has ended');
    }

    return this.dataSource.transaction(async (manager) => {
      const periodDate = this.getCurrentPeriodDate(quest.type);
      
      let progress = await manager.findOne(UserQuestProgress, {
        where: { userId, questId, periodDate },
        lock: { mode: 'pessimistic_write' } // Prevent race conditions
      });

      if (!progress) {
        progress = manager.create(UserQuestProgress, {
          userId,
          questId,
          periodDate,
          currentCount: 0,
          currentStreak: await this.calculateStreak(userId, questId, manager)
        });
      }

      // Prevent multi-completion exploit
      if (progress.completed) {
        throw new BadRequestException('Quest already completed for this period');
      }

      const progressBefore = progress.currentCount;
      progress.currentCount += increment;
      const progressAfter = progress.currentCount;

      // Audit trail
      await manager.save(QuestAudit, {
        userId,
        questId,
        action: 'progress',
        progressBefore,
        progressAfter,
        metadata: { increment, periodDate },
        ipAddress
      });

      let completed = false;
      let rewards = null;

      // Check completion
      if (progress.currentCount >= quest.requiredCount && !progress.completed) {
        progress.completed = true;
        progress.completedAt = new Date();
        progress.lastCompletedAt = new Date();

        // Calculate rewards with streak and frenzy bonuses
        const multiplier = quest.isFrenzyActive ? quest.frenzyMultiplier : 1;
        const streakBonus = quest.enableStreaks ? progress.currentStreak * quest.streakBonusXp : 0;
        
        progress.xpEarned = Math.floor((quest.xpReward + streakBonus) * multiplier);
        progress.tokensEarned = Math.floor(quest.tokenReward * multiplier);

        rewards = {
          xp: progress.xpEarned,
          tokens: progress.tokensEarned,
          streak: progress.currentStreak,
          multiplier
        };

        // Update longest streak
        if (progress.currentStreak > progress.longestStreak) {
          progress.longestStreak = progress.currentStreak;
        }

        await manager.save(QuestAudit, {
          userId,
          questId,
          action: 'completed',
          progressBefore: progressAfter,
          progressAfter: progressAfter,
          metadata: { rewards, periodDate },
          ipAddress
        });

        completed = true;
        this.logger.log(`User ${userId} completed quest ${questId} with ${progress.currentStreak} day streak`);
      }

      await manager.save(UserQuestProgress, progress);

      return { progress, completed, rewards };
    });
  }

  // ==================== STATS ====================

  async getQuestStats(questId: string): Promise<any> {
    await this.findOne(questId); // Validate quest exists

    const [
      totalUsers,
      completedCount,
      avgProgress,
      streakStats
    ] = await Promise.all([
      this.progressRepository.count({ where: { questId } }),
      this.progressRepository.count({ where: { questId, completed: true } }),
      this.progressRepository
        .createQueryBuilder('p')
        .select('AVG(p.currentCount)', 'avg')
        .where('p.questId = :questId', { questId })
        .getRawOne(),
      this.progressRepository
        .createQueryBuilder('p')
        .select('MAX(p.currentStreak)', 'maxStreak')
        .addSelect('AVG(p.currentStreak)', 'avgStreak')
        .where('p.questId = :questId', { questId })
        .getRawOne()
    ]);

    return {
      totalUsers,
      completedCount,
      completionRate: totalUsers > 0 ? (completedCount / totalUsers * 100).toFixed(2) : 0,
      averageProgress: parseFloat(avgProgress?.avg || 0).toFixed(2),
      streaks: {
        max: parseInt(streakStats?.maxStreak || 0),
        average: parseFloat(streakStats?.avgStreak || 0).toFixed(2)
      }
    };
  }

  async getUserQuestHistory(userId: string): Promise<UserQuestProgress[]> {
    return this.progressRepository.find({
      where: { userId },
      relations: ['quest'],
      order: { createdAt: 'DESC' },
      take: 50
    });
  }

  async getAuditLog(questId: string, userId?: string): Promise<QuestAudit[]> {
    const where: any = { questId };
    if (userId) where.userId = userId;

    return this.auditRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100
    });
  }

  // ==================== CRON JOBS ====================

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyReset() {
    this.logger.log('Running daily quest reset...');
    
    const dailyQuests = await this.questRepository.find({
      where: { type: QuestType.DAILY, status: QuestStatus.ACTIVE }
    });

    for (const quest of dailyQuests) {
      await this.incrementStreaks(quest.id);
    }

    this.logger.log(`Daily reset completed for ${dailyQuests.length} quests`);
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyReset() {
    this.logger.log('Running weekly quest reset...');
    
    const weeklyQuests = await this.questRepository.find({
      where: { type: QuestType.WEEKLY, status: QuestStatus.ACTIVE }
    });

    for (const quest of weeklyQuests) {
      await this.incrementStreaks(quest.id);
    }

    this.logger.log(`Weekly reset completed for ${weeklyQuests.length} quests`);
  }

  // ==================== HELPER METHODS ====================

  private getCurrentPeriodDate(type: QuestType): Date {
    const now = new Date();
    if (type === QuestType.WEEKLY) {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      return new Date(now.setDate(diff));
    }
    // Daily
    return new Date(now.toISOString().split('T')[0]);
  }

  private async calculateStreak(userId: string, questId: string, manager: any): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = new Date(yesterday.toISOString().split('T')[0]);

    const lastProgress = await manager.findOne(UserQuestProgress, {
      where: { userId, questId, periodDate: yesterdayDate, completed: true }
    });

    return lastProgress ? lastProgress.currentStreak + 1 : 1;
  }

  private async incrementStreaks(questId: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = new Date(yesterday.toISOString().split('T')[0]);

    // Users who didn't complete yesterday lose their streak
    await this.progressRepository
      .createQueryBuilder()
      .update()
      .set({ currentStreak: 0 })
      .where('questId = :questId', { questId })
      .andWhere('periodDate < :yesterdayDate', { yesterdayDate })
      .andWhere('completed = false')
      .execute();
  }
}