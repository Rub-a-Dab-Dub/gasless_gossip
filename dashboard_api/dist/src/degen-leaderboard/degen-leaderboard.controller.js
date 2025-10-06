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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegenLeaderboardController = void 0;
const common_1 = require("@nestjs/common");
let DegenLeaderboardController = class DegenLeaderboardController {
    degenLeaderboardService;
    constructor(degenLeaderboardService) {
        this.degenLeaderboardService = degenLeaderboardService;
    }
    async computeDegen(dto) {
        return this.degenLeaderboardService.computeDegen(dto);
    }
    async getLeaderboard(query) {
        return this.degenLeaderboardService.getLeaderboard(query);
    }
    async getUserRank(userId, category, cycleId) {
        return this.degenLeaderboardService.getUserRank(userId, category, cycleId);
    }
    async awardBadge(dto) {
        return this.degenLeaderboardService.awardBadge(dto);
    }
    async getUserBadges(userId) {
        return this.degenLeaderboardService.getUserBadges(userId);
    }
    async resetCycle(dto) {
        return this.degenLeaderboardService.resetCycle(dto);
    }
    async getEvents(userId, limit) {
        return this.degenLeaderboardService.getEvents(userId, limit);
    }
    async exportEvents(category, startDate, endDate) {
        return this.degenLeaderboardService.exportEvents(category, new Date(startDate), new Date(endDate));
    }
};
exports.DegenLeaderboardController = DegenLeaderboardController;
__decorate([
    (0, common_1.Post)("compute"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "computeDegen", null);
__decorate([
    (0, common_1.Get)("leaderboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)("users/:userId/rank"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "getUserRank", null);
__decorate([
    (0, common_1.Post)("badges"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "awardBadge", null);
__decorate([
    (0, common_1.Get)("users/:userId/badges"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "getUserBadges", null);
__decorate([
    (0, common_1.Put)("cycles/reset"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "resetCycle", null);
__decorate([
    (0, common_1.Get)("users/:userId/events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)("events/export"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DegenLeaderboardController.prototype, "exportEvents", null);
exports.DegenLeaderboardController = DegenLeaderboardController = __decorate([
    (0, common_1.Controller)("degen-leaderboard"),
    __metadata("design:paramtypes", [Function])
], DegenLeaderboardController);
//# sourceMappingURL=degen-leaderboard.controller.js.map