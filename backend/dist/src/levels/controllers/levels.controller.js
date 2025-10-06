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
exports.LevelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const level_response_dto_1 = require("../dto/level-response.dto");
let LevelsController = class LevelsController {
    levelsService;
    constructor(levelsService) {
        this.levelsService = levelsService;
    }
    async createLevel(createLevelDto) {
        return this.levelsService.createUserLevel(createLevelDto);
    }
    async getUserLevel(userId) {
        return this.levelsService.getUserLevel(userId);
    }
    async addXp(userId, updateLevelDto) {
        const { xpToAdd } = updateLevelDto;
        if (!xpToAdd || xpToAdd <= 0) {
            throw new Error('XP to add must be a positive number');
        }
        return this.levelsService.addXpToUser(userId, xpToAdd);
    }
    async checkLevel(userId) {
        return this.levelsService.checkLevelUp(userId);
    }
    async acknowledgeLevelUp(userId) {
        return this.levelsService.acknowledgeLevelUp(userId);
    }
    async getUserRank(userId) {
        const rank = await this.levelsService.getUserRank(userId);
        return { userId, rank };
    }
    async getLeaderboard(limit) {
        const safeLimit = Math.min(limit || 10, 100);
        return this.levelsService.getLeaderboard(safeLimit);
    }
};
exports.LevelsController = LevelsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new level record for a user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Level record created successfully',
        type: level_response_dto_1.LevelResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - User already has a level record',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "createLevel", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user level information' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User level information retrieved successfully',
        type: level_response_dto_1.LevelResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Level record not found for user',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getUserLevel", null);
__decorate([
    (0, common_1.Post)(':userId/add-xp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Add XP to user and check for level ups' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'XP added successfully, level updated if applicable',
        type: level_response_dto_1.LevelResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Level record not found for user',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "addXp", null);
__decorate([
    (0, common_1.Post)(':userId/check'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Check and update user level based on current XP' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Level check completed, updated if necessary',
        type: level_response_dto_1.LevelResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Level record not found for user',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "checkLevel", null);
__decorate([
    (0, common_1.Post)(':userId/acknowledge-levelup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge level up notification' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Level up acknowledged successfully',
        type: level_response_dto_1.LevelResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Level record not found for user',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "acknowledgeLevelUp", null);
__decorate([
    (0, common_1.Get)(':userId/rank'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user rank in leaderboard' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User rank retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                rank: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Level record not found for user',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getUserRank", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get leaderboard of top users by XP' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of users to return (default: 10, max: 100)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leaderboard retrieved successfully',
        type: [level_response_dto_1.LevelResponseDto],
    }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getLeaderboard", null);
exports.LevelsController = LevelsController = __decorate([
    (0, swagger_1.ApiTags)('levels'),
    (0, common_1.Controller)('levels'),
    __metadata("design:paramtypes", [Function])
], LevelsController);
//# sourceMappingURL=levels.controller.js.map