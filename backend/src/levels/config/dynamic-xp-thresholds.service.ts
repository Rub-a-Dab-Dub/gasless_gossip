import { Injectable, Logger } from '@nestjs/common';
import type { XpThresholdConfig } from './xp-thresholds.config';

export interface DynamicXpThreshold {
  id: string;
  level: number;
  xpRequired: number;
  badgeUnlocked?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DynamicXpThresholdsService {
  private readonly logger = new Logger(DynamicXpThresholdsService.name);
  private cachedThresholds: Map<number, XpThresholdConfig> = new Map();
  private lastCacheUpdate: Date = new Date(0);
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // private readonly thresholdRepository: Repository<DynamicXpThreshold>, // In a real implementation, you would inject the repository
    this.initializeCache();
  }

  async getThresholdForLevel(level: number): Promise<number> {
    await this.refreshCacheIfNeeded();

    const threshold = this.cachedThresholds.get(level);
    return threshold?.xpRequired ?? 0;
  }

  async getNextLevelThreshold(currentLevel: number): Promise<number> {
    const nextLevel = currentLevel + 1;
    return this.getThresholdForLevel(nextLevel);
  }

  async getLevelForXp(totalXp: number): Promise<number> {
    await this.refreshCacheIfNeeded();

    let level = 1;
    for (const [levelNum, threshold] of this.cachedThresholds.entries()) {
      if (totalXp >= threshold.xpRequired) {
        level = levelNum;
      } else {
        break;
      }
    }
    return level;
  }

  async getBadgeForLevel(level: number): Promise<string | undefined> {
    await this.refreshCacheIfNeeded();

    const threshold = this.cachedThresholds.get(level);
    return threshold?.badgeUnlocked;
  }

  async getAllThresholds(): Promise<XpThresholdConfig[]> {
    await this.refreshCacheIfNeeded();

    return Array.from(this.cachedThresholds.values()).sort(
      (a, b) => a.level - b.level,
    );
  }

  async updateThreshold(
    level: number,
    xpRequired: number,
    badgeUnlocked?: string,
  ): Promise<void> {
    this.logger.log(
      `Updating XP threshold for level ${level}: ${xpRequired} XP`,
    );

    // In a real implementation, you would update the database
    /*
    const existingThreshold = await this.thresholdRepository.findOne({
      where: { level, isActive: true },
    });

    if (existingThreshold) {
      existingThreshold.xpRequired = xpRequired;
      existingThreshold.badgeUnlocked = badgeUnlocked;
      await this.thresholdRepository.save(existingThreshold);
    } else {
      const newThreshold = this.thresholdRepository.create({
        level,
        xpRequired,
        badgeUnlocked,
        isActive: true,
      });
      await this.thresholdRepository.save(newThreshold);
    }
    */

    // Update cache immediately
    this.cachedThresholds.set(level, {
      level,
      xpRequired,
      badgeUnlocked,
    });

    this.logger.log(`Successfully updated XP threshold for level ${level}`);
  }

  async createBulkThresholds(
    thresholds: Omit<XpThresholdConfig, 'id'>[],
  ): Promise<void> {
    this.logger.log(`Creating ${thresholds.length} XP thresholds in bulk`);

    // In a real implementation, you would use a transaction
    /*
    await this.thresholdRepository.manager.transaction(async (manager) => {
      for (const threshold of thresholds) {
        const entity = manager.create(DynamicXpThreshold, {
          ...threshold,
          isActive: true,
        });
        await manager.save(entity);
      }
    });
    */

    // Update cache
    for (const threshold of thresholds) {
      this.cachedThresholds.set(threshold.level, threshold);
    }

    this.logger.log(`Successfully created ${thresholds.length} XP thresholds`);
  }

  async deactivateThreshold(level: number): Promise<void> {
    this.logger.log(`Deactivating XP threshold for level ${level}`);

    // In a real implementation, you would update the database
    /*
    await this.thresholdRepository.update(
      { level, isActive: true },
      { isActive: false }
    );
    */

    // Remove from cache
    this.cachedThresholds.delete(level);

    this.logger.log(`Successfully deactivated XP threshold for level ${level}`);
  }

  async validateThresholds(): Promise<{ isValid: boolean; errors: string[] }> {
    await this.refreshCacheIfNeeded();

    const errors: string[] = [];
    const thresholds = Array.from(this.cachedThresholds.values()).sort(
      (a, b) => a.level - b.level,
    );

    // Check for gaps in levels
    for (let i = 1; i < thresholds.length; i++) {
      const current = thresholds[i];
      const previous = thresholds[i - 1];

      if (current.level !== previous.level + 1) {
        errors.push(`Gap in levels: missing level ${previous.level + 1}`);
      }

      if (current.xpRequired <= previous.xpRequired) {
        errors.push(
          `Level ${current.level} XP (${current.xpRequired}) must be greater than level ${previous.level} XP (${previous.xpRequired})`,
        );
      }
    }

    // Check for level 1 starting at 0
    const level1 = thresholds.find((t) => t.level === 1);
    if (!level1 || level1.xpRequired !== 0) {
      errors.push('Level 1 must start at 0 XP');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private async refreshCacheIfNeeded(): Promise<void> {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - this.lastCacheUpdate.getTime();

    if (timeSinceLastUpdate > this.cacheTimeout) {
      await this.loadThresholdsFromDatabase();
      this.lastCacheUpdate = now;
    }
  }

  private async loadThresholdsFromDatabase(): Promise<void> {
    // In a real implementation, you would load from database
    /*
    const thresholds = await this.thresholdRepository.find({
      where: { isActive: true },
      order: { level: 'ASC' },
    });

    this.cachedThresholds.clear();
    for (const threshold of thresholds) {
      this.cachedThresholds.set(threshold.level, {
        level: threshold.level,
        xpRequired: threshold.xpRequired,
        badgeUnlocked: threshold.badgeUnlocked,
      });
    }
    */

    // For now, use default thresholds if cache is empty
    if (this.cachedThresholds.size === 0) {
      this.initializeCache();
    }
  }

  private initializeCache(): void {
    // Load default thresholds from static config
    const { DEFAULT_XP_THRESHOLDS } = require('./xp-thresholds.config');

    this.cachedThresholds.clear();
    for (const threshold of DEFAULT_XP_THRESHOLDS) {
      this.cachedThresholds.set(threshold.level, threshold);
    }

    this.logger.log(
      `Initialized XP thresholds cache with ${this.cachedThresholds.size} levels`,
    );
  }

  async exportThresholds(): Promise<XpThresholdConfig[]> {
    return this.getAllThresholds();
  }

  async importThresholds(thresholds: XpThresholdConfig[]): Promise<void> {
    this.logger.log(`Importing ${thresholds.length} XP thresholds`);

    // Validate before importing
    const validation = await this.validateImportedThresholds(thresholds);
    if (!validation.isValid) {
      throw new Error(`Invalid thresholds: ${validation.errors.join(', ')}`);
    }

    // Clear existing thresholds and import new ones
    await this.clearAllThresholds();
    await this.createBulkThresholds(thresholds);

    this.logger.log(`Successfully imported ${thresholds.length} XP thresholds`);
  }

  private async validateImportedThresholds(
    thresholds: XpThresholdConfig[],
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const sortedThresholds = [...thresholds].sort((a, b) => a.level - b.level);

    // Check for duplicates
    const levels = new Set();
    for (const threshold of thresholds) {
      if (levels.has(threshold.level)) {
        errors.push(`Duplicate level: ${threshold.level}`);
      }
      levels.add(threshold.level);
    }

    // Check progression
    for (let i = 1; i < sortedThresholds.length; i++) {
      const current = sortedThresholds[i];
      const previous = sortedThresholds[i - 1];

      if (current.xpRequired <= previous.xpRequired) {
        errors.push(
          `Level ${current.level} XP (${current.xpRequired}) must be greater than level ${previous.level} XP (${previous.xpRequired})`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private async clearAllThresholds(): Promise<void> {
    // In a real implementation, you would clear the database
    /*
    await this.thresholdRepository.update(
      { isActive: true },
      { isActive: false }
    );
    */

    this.cachedThresholds.clear();
  }
}
