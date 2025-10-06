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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const achievements_service_1 = require("./achievements.service");
const dto_1 = require("./dto");
let AchievementsController = class AchievementsController {
    achievementsService;
    constructor(achievementsService) {
        this.achievementsService = achievementsService;
    }
    async getUserAchievements(userId) {
        return this.achievementsService.getUserAchievements(userId);
    }
    async awardAchievement(awardDto) {
        return this.achievementsService.awardAchievement(awardDto);
    }
    async checkAndAwardMilestones(checkDto) {
        return this.achievementsService.checkAndAwardMilestones(checkDto);
    }
    async getUserAchievementStats(userId) {
        return this.achievementsService.getUserAchievementStats(userId);
    }
    getAchievementTypes() {
        return this.achievementsService.getAchievementTypes();
    }
};
exports.AchievementsController = AchievementsController;
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all achievements for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of user achievements',
        type: [dto_1.AchievementResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getUserAchievements", null);
__decorate([
    (0, common_1.Post)('award'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Award an achievement to a user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Achievement awarded successfully',
        type: dto_1.AchievementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - achievement already exists or invalid data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AwardAchievementDto]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "awardAchievement", null);
__decorate([
    (0, common_1.Post)('check-milestones'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Check and award milestones for a user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Milestones checked and new achievements awarded',
        type: [dto_1.AchievementResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - invalid data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CheckMilestoneDto]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "checkAndAwardMilestones", null);
__decorate([
    (0, common_1.Get)(':userId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get achievement statistics for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User achievement statistics',
        schema: {
            type: 'object',
            properties: {
                totalAchievements: { type: 'number' },
                totalRewards: { type: 'number' },
                achievementsByType: { type: 'object' },
                achievementsByTier: { type: 'object' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getUserAchievementStats", null);
__decorate([
    (0, common_1.Get)('types/available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available achievement types and their thresholds' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Available achievement types and thresholds',
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AchievementsController.prototype, "getAchievementTypes", null);
exports.AchievementsController = AchievementsController = __decorate([
    (0, swagger_1.ApiTags)('achievements'),
    (0, common_1.Controller)('achievements'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __metadata("design:paramtypes", [achievements_service_1.AchievementsService])
], AchievementsController);
//# sourceMappingURL=achievements.controller.js.map