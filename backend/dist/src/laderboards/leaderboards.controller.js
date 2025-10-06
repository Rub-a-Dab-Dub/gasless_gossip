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
exports.LeaderboardsController = void 0;
const common_1 = require("@nestjs/common");
const leaderboards_service_1 = require("./leaderboards.service");
const create_leaderboard_dto_1 = require("./dto/create-leaderboard.dto");
const leaderboard_entity_1 = require("./entities/leaderboard.entity");
let LeaderboardsController = class LeaderboardsController {
    leaderboardsService;
    constructor(leaderboardsService) {
        this.leaderboardsService = leaderboardsService;
    }
    async getLeaderboard(type, query) {
        const leaderboardQuery = {
            type,
            ...query,
        };
        return this.leaderboardsService.getLeaderboard(leaderboardQuery);
    }
    async getUserRank(userId, type) {
        const rank = await this.leaderboardsService.getUserRank(userId, type);
        return {
            userId,
            type,
            ...rank,
        };
    }
    async getTopUsers(type, limit) {
        return this.leaderboardsService.getTopUsers(type, limit);
    }
    async updateUserScore(createLeaderboardDto) {
        return this.leaderboardsService.updateUserScore(createLeaderboardDto);
    }
    async generateSampleData() {
        await this.leaderboardsService.generateSampleData();
        return { message: 'Sample data generated successfully' };
    }
};
exports.LeaderboardsController = LeaderboardsController;
__decorate([
    (0, common_1.Get)(':type'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('user/:userId/rank/:type'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getUserRank", null);
__decorate([
    (0, common_1.Get)('top/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "getTopUsers", null);
__decorate([
    (0, common_1.Post)('score'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leaderboard_dto_1.CreateLeaderboardDto]),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "updateUserScore", null);
__decorate([
    (0, common_1.Post)('generate-sample-data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaderboardsController.prototype, "generateSampleData", null);
exports.LeaderboardsController = LeaderboardsController = __decorate([
    (0, common_1.Controller)('leaderboards'),
    __metadata("design:paramtypes", [leaderboards_service_1.LeaderboardsService])
], LeaderboardsController);
//# sourceMappingURL=leaderboards.controller.js.map