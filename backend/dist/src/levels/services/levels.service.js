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
var LevelsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsService = void 0;
const common_1 = require("@nestjs/common");
const xp_thresholds_config_1 = require("../config/xp-thresholds.config");
const level_up_event_1 = require("../events/level-up.event");
let LevelsService = LevelsService_1 = class LevelsService {
    logger = new common_1.Logger(LevelsService_1.name);
    levelRepository;
    eventEmitter;
    constructor(levelRepository, eventEmitter) {
        this.levelRepository = levelRepository;
        this.eventEmitter = eventEmitter;
    }
    async createUserLevel(createLevelDto) {
        const { userId, level = 1, currentXp = 0, totalXp = 0 } = createLevelDto;
        const existingLevel = await this.levelRepository.findOne({
            where: { userId },
        });
        if (existingLevel) {
            throw new Error('User already has a level record');
        }
        const xpThreshold = xp_thresholds_config_1.XpThresholdsConfig.getNextLevelThreshold(level);
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
    async getUserLevel(userId) {
        const level = await this.levelRepository.findOne({
            where: { userId },
        });
        if (!level) {
            throw new common_1.NotFoundException(`Level record not found for user ${userId}`);
        }
        return this.mapToResponseDto(level);
    }
    async addXpToUser(userId, xpToAdd, source = 'unknown') {
        const level = await this.levelRepository.findOne({
            where: { userId },
        });
        if (!level) {
            throw new common_1.NotFoundException(`Level record not found for user ${userId}`);
        }
        const previousLevel = level.level;
        const newTotalXp = level.totalXp + xpToAdd;
        const newLevel = xp_thresholds_config_1.XpThresholdsConfig.getLevelForXp(newTotalXp);
        level.totalXp = newTotalXp;
        level.currentXp =
            newTotalXp - xp_thresholds_config_1.XpThresholdsConfig.getThresholdForLevel(newLevel);
        level.xpThreshold = xp_thresholds_config_1.XpThresholdsConfig.getNextLevelThreshold(newLevel);
        this.eventEmitter.emit('xp.gained', {
            userId,
            xpAmount: xpToAdd,
            source,
            timestamp: new Date(),
        });
        if (newLevel > previousLevel) {
            level.level = newLevel;
            level.isLevelUpPending = true;
            const badgesUnlocked = [];
            for (let i = previousLevel + 1; i <= newLevel; i++) {
                const badge = xp_thresholds_config_1.XpThresholdsConfig.getBadgeForLevel(i);
                if (badge) {
                    badgesUnlocked.push(badge);
                }
            }
            const levelUpEvent = new level_up_event_1.LevelUpEvent(userId, previousLevel, newLevel, newTotalXp, badgesUnlocked);
            this.eventEmitter.emit('level.up', levelUpEvent);
            this.logger.log(`User ${userId} leveled up from ${previousLevel} to ${newLevel} with ${newTotalXp} total XP`);
        }
        const savedLevel = await this.levelRepository.save(level);
        return this.mapToResponseDto(savedLevel);
    }
    async checkLevelUp(userId) {
        const level = await this.levelRepository.findOne({
            where: { userId },
        });
        if (!level) {
            throw new common_1.NotFoundException(`Level record not found for user ${userId}`);
        }
        const currentLevel = xp_thresholds_config_1.XpThresholdsConfig.getLevelForXp(level.totalXp);
        if (currentLevel > level.level) {
            const previousLevel = level.level;
            level.level = currentLevel;
            level.currentXp =
                level.totalXp - xp_thresholds_config_1.XpThresholdsConfig.getThresholdForLevel(currentLevel);
            level.xpThreshold =
                xp_thresholds_config_1.XpThresholdsConfig.getNextLevelThreshold(currentLevel);
            level.isLevelUpPending = true;
            const badgesUnlocked = [];
            for (let i = previousLevel + 1; i <= currentLevel; i++) {
                const badge = xp_thresholds_config_1.XpThresholdsConfig.getBadgeForLevel(i);
                if (badge) {
                    badgesUnlocked.push(badge);
                }
            }
            const levelUpEvent = new level_up_event_1.LevelUpEvent(userId, previousLevel, currentLevel, level.totalXp, badgesUnlocked);
            this.eventEmitter.emit('level.up', levelUpEvent);
            await this.levelRepository.save(level);
        }
        return this.mapToResponseDto(level);
    }
    async acknowledgeLevelUp(userId) {
        const level = await this.levelRepository.findOne({
            where: { userId },
        });
        if (!level) {
            throw new common_1.NotFoundException(`Level record not found for user ${userId}`);
        }
        level.isLevelUpPending = false;
        const savedLevel = await this.levelRepository.save(level);
        return this.mapToResponseDto(savedLevel);
    }
    async getLeaderboard(limit = 10) {
        const levels = await this.levelRepository.find({
            order: { totalXp: 'DESC' },
            take: limit,
        });
        return levels.map((level) => this.mapToResponseDto(level));
    }
    async getUserRank(userId) {
        const userLevel = await this.levelRepository.findOne({
            where: { userId },
        });
        if (!userLevel) {
            throw new common_1.NotFoundException(`Level record not found for user ${userId}`);
        }
        const rank = await this.levelRepository
            .createQueryBuilder('level')
            .where('level.total_xp > :userXp', { userXp: userLevel.totalXp })
            .getCount();
        return rank + 1;
    }
    mapToResponseDto(level) {
        const xpToNextLevel = Math.max(0, level.xpThreshold - level.currentXp);
        const progressPercentage = level.xpThreshold > 0
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
};
exports.LevelsService = LevelsService;
exports.LevelsService = LevelsService = LevelsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Object])
], LevelsService);
//# sourceMappingURL=levels.service.js.map