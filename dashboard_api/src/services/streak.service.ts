import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { StreakEntity } from '../entities/streak.entity';
import { CreateStreakDto, UpdateStreakDto } from '../dto/streak.dto';

@Injectable()
export class StreakService {
  constructor(
    @InjectRepository(StreakEntity)
    private readonly streakRepository: Repository<StreakEntity>,
  ) {}

  async create(createStreakDto: CreateStreakDto): Promise<StreakEntity> {
    const streak = this.streakRepository.create({
      ...createStreakDto,
      lastActivityDate: new Date(),
      currentStreak: 1,
      longestStreak: 1,
    });
    return this.streakRepository.save(streak);
  }

  async updateStreak(userId: string): Promise<StreakEntity> {
    const streak = await this.streakRepository.findOne({ where: { userId } });
    if (!streak) {
      return this.create({ userId });
    }

    const now = new Date();
    const lastActivity = new Date(streak.lastActivityDate);
    const timeDiff = now.getTime() - lastActivity.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Already updated today
      return streak;
    } else if (daysDiff === 1) {
      // Consecutive day
      streak.currentStreak += 1;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
    } else {
      // Streak broken
      streak.currentStreak = 1;
    }

    streak.lastActivityDate = now;
    return this.streakRepository.save(streak);
  }

  async resetStreak(userId: string): Promise<StreakEntity> {
    const streak = await this.streakRepository.findOne({ where: { userId } });
    if (!streak) {
      throw new NotFoundException(`Streak not found for user ${userId}`);
    }

    streak.currentStreak = 0;
    streak.lastActivityDate = new Date();
    return this.streakRepository.save(streak);
  }

  async applyBoost(userId: string, multiplier: number): Promise<StreakEntity> {
    const streak = await this.streakRepository.findOne({ where: { userId } });
    if (!streak) {
      throw new NotFoundException(`Streak not found for user ${userId}`);
    }

    streak.multiplier = multiplier;
    return this.streakRepository.save(streak);
  }

  async getTopStreaks(limit: number = 10): Promise<StreakEntity[]> {
    return this.streakRepository.find({
      where: { isActive: true },
      order: { currentStreak: 'DESC' },
      take: limit,
    });
  }

  async getUserStreak(userId: string): Promise<StreakEntity> {
    const streak = await this.streakRepository.findOne({ where: { userId } });
    if (!streak) {
      throw new NotFoundException(`Streak not found for user ${userId}`);
    }
    return streak;
  }

  async checkAndResetInactiveStreaks(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const inactiveStreaks = await this.streakRepository.find({
      where: {
        lastActivityDate: LessThan(yesterday),
        isActive: true,
      },
    });

    for (const streak of inactiveStreaks) {
      streak.currentStreak = 0;
      streak.isActive = false;
    }

    await this.streakRepository.save(inactiveStreaks);
  }
}