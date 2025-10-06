"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DynamicXpThresholdsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicXpThresholdsService = void 0;
const common_1 = require("@nestjs/common");
let DynamicXpThresholdsService = DynamicXpThresholdsService_1 = class DynamicXpThresholdsService {
    logger = new common_1.Logger(DynamicXpThresholdsService_1.name);
    cachedThresholds = new Map();
    lastCacheUpdate = new Date(0);
    cacheTimeout = 5 * 60 * 1000;
    constructor() {
        this.initializeCache();
    }
    async getThresholdForLevel(level) {
        await this.refreshCacheIfNeeded();
        const threshold = this.cachedThresholds.get(level);
        return threshold?.xpRequired ?? 0;
    }
    async getNextLevelThreshold(currentLevel) {
        const nextLevel = currentLevel + 1;
        return this.getThresholdForLevel(nextLevel);
    }
    async getLevelForXp(totalXp) {
        await this.refreshCacheIfNeeded();
        let level = 1;
        for (const [levelNum, threshold] of this.cachedThresholds.entries()) {
            if (totalXp >= threshold.xpRequired) {
                level = levelNum;
            }
            else {
                break;
            }
        }
        return level;
    }
    async getBadgeForLevel(level) {
        await this.refreshCacheIfNeeded();
        const threshold = this.cachedThresholds.get(level);
        return threshold?.badgeUnlocked;
    }
    async getAllThresholds() {
        await this.refreshCacheIfNeeded();
        return Array.from(this.cachedThresholds.values()).sort((a, b) => a.level - b.level);
    }
    async updateThreshold(level, xpRequired, badgeUnlocked) {
        this.logger.log(`Updating XP threshold for level ${level}: ${xpRequired} XP`);
        this.cachedThresholds.set(level, {
            level,
            xpRequired,
            badgeUnlocked,
        });
        this.logger.log(`Successfully updated XP threshold for level ${level}`);
    }
    async createBulkThresholds(thresholds) {
        this.logger.log(`Creating ${thresholds.length} XP thresholds in bulk`);
        for (const threshold of thresholds) {
            this.cachedThresholds.set(threshold.level, threshold);
        }
        this.logger.log(`Successfully created ${thresholds.length} XP thresholds`);
    }
    async deactivateThreshold(level) {
        this.logger.log(`Deactivating XP threshold for level ${level}`);
        this.cachedThresholds.delete(level);
        this.logger.log(`Successfully deactivated XP threshold for level ${level}`);
    }
    async validateThresholds() {
        await this.refreshCacheIfNeeded();
        const errors = [];
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
        const level1 = thresholds.find((t) => t.level === 1);
        if (!level1 || level1.xpRequired !== 0) {
            errors.push('Level 1 must start at 0 XP');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    async refreshCacheIfNeeded() {
        const now = new Date();
        const timeSinceLastUpdate = now.getTime() - this.lastCacheUpdate.getTime();
        if (timeSinceLastUpdate > this.cacheTimeout) {
            await this.loadThresholdsFromDatabase();
            this.lastCacheUpdate = now;
        }
    }
    async loadThresholdsFromDatabase() {
        if (this.cachedThresholds.size === 0) {
            this.initializeCache();
        }
    }
    initializeCache() {
        const { DEFAULT_XP_THRESHOLDS } = require('./xp-thresholds.config');
        this.cachedThresholds.clear();
        for (const threshold of DEFAULT_XP_THRESHOLDS) {
            this.cachedThresholds.set(threshold.level, threshold);
        }
        this.logger.log(`Initialized XP thresholds cache with ${this.cachedThresholds.size} levels`);
    }
    async exportThresholds() {
        return this.getAllThresholds();
    }
    async importThresholds(thresholds) {
        this.logger.log(`Importing ${thresholds.length} XP thresholds`);
        const validation = await this.validateImportedThresholds(thresholds);
        if (!validation.isValid) {
            throw new Error(`Invalid thresholds: ${validation.errors.join(', ')}`);
        }
        await this.clearAllThresholds();
        await this.createBulkThresholds(thresholds);
        this.logger.log(`Successfully imported ${thresholds.length} XP thresholds`);
    }
    async validateImportedThresholds(thresholds) {
        const errors = [];
        const sortedThresholds = [...thresholds].sort((a, b) => a.level - b.level);
        const levels = new Set();
        for (const threshold of thresholds) {
            if (levels.has(threshold.level)) {
                errors.push(`Duplicate level: ${threshold.level}`);
            }
            levels.add(threshold.level);
        }
        for (let i = 1; i < sortedThresholds.length; i++) {
            const current = sortedThresholds[i];
            const previous = sortedThresholds[i - 1];
            if (current.xpRequired <= previous.xpRequired) {
                errors.push(`Level ${current.level} XP (${current.xpRequired}) must be greater than level ${previous.level} XP (${previous.xpRequired})`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    async clearAllThresholds() {
        this.cachedThresholds.clear();
    }
};
exports.DynamicXpThresholdsService = DynamicXpThresholdsService;
exports.DynamicXpThresholdsService = DynamicXpThresholdsService = DynamicXpThresholdsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DynamicXpThresholdsService);
//# sourceMappingURL=dynamic-xp-thresholds.service.js.map