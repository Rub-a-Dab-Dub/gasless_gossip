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
    // private readonly thresholdRepository: Repository<DynamicXpThreshold>
    this.initializeCache();
  }

  async getThresholdForLevel(level: number): Promise<number> {
    await this.refreshCacheIfNeeded();
    const threshold = this.cachedThresholds.get(level);
    return threshold?.xpRequired ?? 0;
  }

  async getNextLevelThreshold(currentLevel: number): Promise<number> {
    return this.getThresholdForLevel(currentLevel + 1);
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
    return this.cachedThresholds.get(level)?.badgeUnlocked;
  }

  async getAllThresholds(): Promise<XpThresholdConfig[]> {
    await this.refreshCacheIfNeeded();
    return Array.from(this.cachedThresholds.values()).sort((a, b) => a.level - b.level);
  }

  async updateThreshold(
    level: number,
    xpRequired: number,
    badgeUnlocked?: string,
  ): Promise<void> {
    this.logger.log(`Updating XP threshold for level ${level}: ${xpRequired} XP`);
    this.cachedThresholds.set(level, { level, xpRequired, badgeUnlocked });
    this.logger.log(`Successfully updated XP threshold for level ${level}`);
  }

  async createBulkThresholds(thresholds: Omit<XpThresholdConfig, 'id'>[]): Promise<void> {
    this.logger.log(`Creating ${thresholds.length} XP thresholds in bulk`);
    for (const threshold of thresholds) {
      this.cachedThresholds.set(threshold.level, threshold);
    }
    this.logger.log(`Successfully created ${thresholds.length} XP thresholds`);
  }

  async deactivateThreshold(level: number): Promise<void> {
    this.logger.log(`Deactivating XP threshold for level ${level}`);
    this.cachedThresholds.delete(level);
    this.logger.log(`Successfully deactivated XP threshold for level ${level}`);
  }

  async validateThresholds(): Promise<{ isValid: boolean; errors: string[] }> {
    await this.refreshCacheIfNeeded();
    const errors: string[] = [];
    const thresholds = Array.from(this.cachedThresholds.values()).sort((a, b) => a.level - b.level);

    for (let i = 1; i < thresholds.length; i++) {
      const current = thresholds[i];
      const previous = thresholds[i - 1];
      if (current.level !== previous.level + 1) {
        errors.push(`Gap in levels: missing level ${previous.level + 1}`);
      }
      if (current.xpRequired <= previous.xpRequired) {
        errors.push(`Level ${current.level} XP (${current.xpRequired}) must be greater than level ${previous.level} XP (${previous.xpRequired})`);
      }
    }

    const level1 = thresholds.find(t => t.level === 1);
    if (!level1 || level1.xpRequired !== 0) {
      errors.push('Level 1 must start at 0 XP');
    }

    return { isValid: errors.length === 0, errors };
  }

  private async refreshCacheIfNeeded(): Promise<void> {
    const now = new Date();
    if (now.getTime() - this.lastCacheUpdate.getTime() > this.cacheTimeout) {
      await this.loadThresholdsFromDatabase();
      this.lastCacheUpdate = now;
    }
  }

  private async loadThresholdsFromDatabase(): Promise<void> {
    // Simulate database load; use default if empty
    if (this.cachedThresholds.size === 0) {
      this.initializeCache();
    }
  }

  private initializeCache(): void {
    const { DEFAULT_XP_THRESHOLDS } = require('./xp-thresholds.config');
    this.cachedThresholds.clear();
    for (const threshold of DEFAULT_XP_THRESHOLDS) {
      this.cachedThresholds.set(threshold.level, threshold);
    }
    this.logger.log(`Initialized XP thresholds cache with ${this.cachedThresholds.size} levels`);
  }

  async exportThresholds(): Promise<XpThresholdConfig[]> {
    return this.getAllThresholds();
  }

  async importThresholds(thresholds: XpThresholdConfig[]): Promise<void> {
    this.logger.log(`Importing ${thresholds.length} XP thresholds`);
    const validation = await this.validateImportedThresholds(thresholds);
    if (!validation.isValid) throw new Error(`Invalid thresholds: ${validation.errors.join(', ')}`);
    await this.clearAllThresholds();
    await this.createBulkThresholds(thresholds);
    this.logger.log(`Successfully imported ${thresholds.length} XP thresholds`);
  }

  private async validateImportedThresholds(thresholds: XpThresholdConfig[]): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const sorted = [...thresholds].sort((a, b) => a.level - b.level);
    const levels = new Set<number>();
    for (const t of thresholds) {
      if (levels.has(t.level)) errors.push(`Duplicate level: ${t.level}`);
      levels.add(t.level);
    }
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].xpRequired <= sorted[i - 1].xpRequired) {
        errors.push(`Level ${sorted[i].level} XP (${sorted[i].xpRequired}) must be greater than level ${sorted[i - 1].lev
