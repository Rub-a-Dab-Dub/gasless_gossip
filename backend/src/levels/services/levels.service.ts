import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { EventEmitter2 } from '@nestjs/event-emitter';
import type { Level } from '../entities/level.entity';
import type { CreateLevelDto } from '../dto/create-level.dto';
import type { LevelResponseDto } from '../dto/level-response.dto';
import { XpThresholdsConfig } from '../config/xp-thresholds.config';
import { LevelUpEvent } from '../events/level-up.event';

@Injectable()
export class LevelsService {
  private readonly logger = new Logger(LevelsService.name);
  private readonly levelRepository: Repository<Level>;
  private readonly eventEmitter: EventEmitter2;

  constructor(levelRepository: Repository<Level>, eventEmitter: EventEmitter2) {
    this.levelRepository = levelRepository;
    this.eventEmitter = eventEmitter;
  }

  async createUserLevel(
    createLevelDto: CreateLevelDto,
  ): Promise<LevelResponseDto> {
    const { userId, level = 1, currentXp = 0, totalXp = 0 } = createLevelDto;

    // Check if user already has a level record
    const existingLevel = await this.levelRepository.findOne({
      where: { userId },
    });

    if (existingLevel) {
      throw new Error('User already has a level record');
    }

    const xpThreshold = XpThresholdsConfig.getNextLevelThreshold(level);

    const newLevel = this.levelRepository.create({
      userId,
      level,
      currentXp,
      totalXp,
      xpThreshold,
    });

    const savedLevel = await this.levelRepository.save(newLevel);
    return this.mapToResponseDto(savedLevel);
  }

  async getUserLevel(userId: string): Promise<LevelResponseDto> {
    const level = await this.levelRepository.findOne({
      where: { userId },
    });

    if (!level) {
      throw new NotFoundException(`Level record not found for user ${userId}`);
    }

    return this.mapToResponseDto(level);
  }

  async addXpToUser(
    userId: string,
    xpToAdd: number,
    source: string = 'unknown',
  ): Promise<LevelResponseDto> {
    const level = await this.levelRepository.findOne({
      where: { userId },
    });

    if (!level) {
      throw new NotFoundException(`Level record not found for user ${userId}`);
    }

    const previousLevel = level.level;
    const newTotalXp = level.totalXp + xpToAdd;
    const newLevel = XpThresholdsConfig.getLevelForXp(newTotalXp);

    // Update level data
    level.totalXp = newTotalXp;
    level.currentXp =
      newTotalXp - XpThresholdsConfig.getThresholdForLevel(newLevel);
    level.xpThreshold = XpThresholdsConfig.getNextLevelThreshold(newLevel);

    // Emit XP gained event for cache invalidation
    this.eventEmitter.emit('xp.gained', {
      userId,
      xpAmount: xpToAdd,
      source,
      timestamp: new Date(),
    });

    // Check for level up
    if (newLevel > previousLevel) {
      level.level = newLevel;
      level.isLevelUpPending = true;

      // Get badges unlocked for new levels
      const badgesUnlocked: string[] = [];
      for (let i = previousLevel + 1; i <= newLevel; i++) {
        const badge = XpThresholdsConfig.getBadgeForLevel(i);
        if (badge) {
          badgesUnlocked.push(badge);
        }
      }

      // Emit level up event
      const levelUpEvent = new LevelUpEvent(
        userId,
        previousLevel,
        newLevel,
        newTotalXp,
        badgesUnlocked,
      );

      this.eventEmitter.emit('level.up', levelUpEvent);

      this.logger.log(
        `User ${userId} leveled up from ${previousLevel} to ${newLevel} with ${newTotalXp} total XP`,
      );
    }

    const savedLevel = await this.levelRepository.save(level);
    return this.mapToResponseDto(savedLevel);
  }

  async checkLevelUp(userId: string): Promise<LevelResponseDto> {
    const level = await this.levelRepository.findOne({
      where: { userId },
    });

    if (!level) {
      throw new NotFoundException(`Level record not found for user ${userId}`);
    }

    const currentLevel = XpThresholdsConfig.getLevelForXp(level.totalXp);

    if (currentLevel > level.level) {
      const previousLevel = level.level;
      level.level = currentLevel;
      level.currentXp =
        level.totalXp - XpThresholdsConfig.getThresholdForLevel(currentLevel);
      level.xpThreshold =
        XpThresholdsConfig.getNextLevelThreshold(currentLevel);
      level.isLevelUpPending = true;

      // Get badges unlocked for new levels
      const badgesUnlocked: string[] = [];
      for (let i = previousLevel + 1; i <= currentLevel; i++) {
        const badge = XpThresholdsConfig.getBadgeForLevel(i);
        if (badge) {
          badgesUnlocked.push(badge);
        }
      }

      // Emit level up event
      const levelUpEvent = new LevelUpEvent(
        userId,
        previousLevel,
        currentLevel,
        level.totalXp,
        badgesUnlocked,
      );

      this.eventEmitter.emit('level.up', levelUpEvent);

      await this.levelRepository.save(level);
    }

    return this.mapToResponseDto(level);
  }

  async acknowledgeLevelUp(userId: string): Promise<LevelResponseDto> {
    const level = await this.levelRepository.findOne({
      where: { userId },
    });

    if (!level) {
      throw new NotFoundException(`Level record not found for user ${userId}`);
    }

    level.isLevelUpPending = false;
    const savedLevel = await this.levelRepository.save(level);

    return this.mapToResponseDto(savedLevel);
  }

  async getLeaderboard(limit = 10): Promise<LevelResponseDto[]> {
    const levels = await this.levelRepository.find({
      order: { totalXp: 'DESC' },
      take: limit,
    });

    return levels.map((level) => this.mapToResponseDto(level));
  }

  async getUserRank(userId: string): Promise<number> {
    const userLevel = await this.levelRepository.findOne({
      where: { userId },
    });

    if (!userLevel) {
      throw new NotFoundException(`Level record not found for user ${userId}`);
    }

    const rank = await this.levelRepository
      .createQueryBuilder('level')
      .where('level.total_xp > :userXp', { userXp: userLevel.totalXp })
      .getCount();

    return rank + 1; // Add 1 because rank is 0-indexed
  }

  private mapToResponseDto(level: Level): LevelResponseDto {
    const xpToNextLevel = Math.max(0, level.xpThreshold - level.currentXp);
    const progressPercentage =
      level.xpThreshold > 0
        ? Math.round((level.currentXp / level.xpThreshold) * 100)
        : 0;

    return {
      id: level.id,
      userId: level.userId,
      level: level.level,
      currentXp: level.currentXp,
      xpThreshold: level.xpThreshold,
      totalXp: level.totalXp,
      isLevelUpPending: level.isLevelUpPending,
      xpToNextLevel,
      progressPercentage,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    };
  }
}
