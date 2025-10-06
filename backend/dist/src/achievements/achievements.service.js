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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AchievementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const achievement_entity_1 = require("./entities/achievement.entity");
const user_entity_1 = require("../users/entities/user.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let AchievementsService = AchievementsService_1 = class AchievementsService {
    achievementRepository;
    userRepository;
    stellarService;
    logger = new common_1.Logger(AchievementsService_1.name);
    milestoneThresholds = {
        [achievement_entity_1.AchievementType.MESSAGES_SENT]: [10, 50, 100, 500, 1000],
        [achievement_entity_1.AchievementType.ROOMS_JOINED]: [5, 25, 50, 100, 250],
        [achievement_entity_1.AchievementType.PREDICTIONS_MADE]: [5, 25, 50, 100, 200],
        [achievement_entity_1.AchievementType.BETS_PLACED]: [5, 25, 50, 100, 200],
        [achievement_entity_1.AchievementType.GAMBLES_PLAYED]: [5, 25, 50, 100, 200],
        [achievement_entity_1.AchievementType.TRADES_COMPLETED]: [5, 25, 50, 100, 200],
        [achievement_entity_1.AchievementType.VISITS_MADE]: [10, 50, 100, 500, 1000],
        [achievement_entity_1.AchievementType.LEVEL_REACHED]: [5, 10, 20, 30, 50],
        [achievement_entity_1.AchievementType.STREAK_DAYS]: [3, 7, 14, 30, 60],
        [achievement_entity_1.AchievementType.TOKENS_EARNED]: [100, 500, 1000, 5000, 10000],
    };
    tierRewards = {
        [achievement_entity_1.AchievementTier.BRONZE]: 10,
        [achievement_entity_1.AchievementTier.SILVER]: 25,
        [achievement_entity_1.AchievementTier.GOLD]: 50,
        [achievement_entity_1.AchievementTier.PLATINUM]: 100,
        [achievement_entity_1.AchievementTier.DIAMOND]: 250,
    };
    constructor(achievementRepository, userRepository, stellarService) {
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
        this.stellarService = stellarService;
    }
    async getUserAchievements(userId) {
        const achievements = await this.achievementRepository.find({
            where: { userId },
            order: { awardedAt: 'DESC' },
        });
        return achievements;
    }
    async awardAchievement(awardDto) {
        const { userId, type, tier = achievement_entity_1.AchievementTier.BRONZE, milestoneValue, rewardAmount } = awardDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const existingAchievement = await this.achievementRepository.findOne({
            where: { userId, type, milestoneValue },
        });
        if (existingAchievement) {
            throw new common_1.BadRequestException(`Achievement of type ${type} for milestone ${milestoneValue} already exists for user ${userId}`);
        }
        const finalRewardAmount = rewardAmount || this.tierRewards[tier];
        const achievement = this.achievementRepository.create({
            userId,
            type,
            tier,
            milestoneValue,
            rewardAmount: finalRewardAmount,
        });
        const savedAchievement = await this.achievementRepository.save(achievement);
        try {
            await this.stellarService.distributeReward(userId, finalRewardAmount);
            this.logger.log(`Awarded achievement ${savedAchievement.id} to user ${userId} with ${finalRewardAmount} tokens`);
        }
        catch (error) {
            this.logger.error(`Failed to distribute Stellar reward for achievement ${savedAchievement.id}:`, error);
        }
        return savedAchievement;
    }
    async checkAndAwardMilestones(checkDto) {
        const { userId, type, currentValue } = checkDto;
        const thresholds = this.milestoneThresholds[type];
        if (!thresholds) {
            throw new common_1.BadRequestException(`Invalid achievement type: ${type}`);
        }
        const reachedMilestones = thresholds.filter(threshold => currentValue >= threshold);
        if (reachedMilestones.length === 0) {
            return [];
        }
        const existingAchievements = await this.achievementRepository.find({
            where: { userId, type },
        });
        const existingMilestones = existingAchievements.map(a => a.milestoneValue);
        const newMilestones = reachedMilestones.filter(milestone => !existingMilestones.includes(milestone));
        const newAchievements = [];
        for (const milestone of newMilestones) {
            const tier = this.getTierForMilestone(type, milestone);
            const rewardAmount = this.tierRewards[tier];
            try {
                const achievement = await this.awardAchievement({
                    userId,
                    type,
                    tier,
                    milestoneValue: milestone,
                    rewardAmount,
                });
                newAchievements.push(achievement);
            }
            catch (error) {
                this.logger.error(`Failed to award achievement for milestone ${milestone}:`, error);
            }
        }
        return newAchievements;
    }
    async getUserAchievementStats(userId) {
        const achievements = await this.getUserAchievements(userId);
        const stats = {
            totalAchievements: achievements.length,
            totalRewards: achievements.reduce((sum, a) => sum + Number(a.rewardAmount), 0),
            achievementsByType: {},
            achievementsByTier: {},
        };
        Object.values(achievement_entity_1.AchievementType).forEach(type => {
            stats.achievementsByType[type] = 0;
        });
        Object.values(achievement_entity_1.AchievementTier).forEach(tier => {
            stats.achievementsByTier[tier] = 0;
        });
        achievements.forEach(achievement => {
            stats.achievementsByType[achievement.type]++;
            stats.achievementsByTier[achievement.tier]++;
        });
        return stats;
    }
    getTierForMilestone(type, milestone) {
        const thresholds = this.milestoneThresholds[type];
        const index = thresholds.indexOf(milestone);
        switch (index) {
            case 0:
                return achievement_entity_1.AchievementTier.BRONZE;
            case 1:
                return achievement_entity_1.AchievementTier.SILVER;
            case 2:
                return achievement_entity_1.AchievementTier.GOLD;
            case 3:
                return achievement_entity_1.AchievementTier.PLATINUM;
            case 4:
                return achievement_entity_1.AchievementTier.DIAMOND;
            default:
                return achievement_entity_1.AchievementTier.BRONZE;
        }
    }
    getAchievementTypes() {
        return this.milestoneThresholds;
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = AchievementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(achievement_entity_1.Achievement)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stellar_service_1.StellarService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map