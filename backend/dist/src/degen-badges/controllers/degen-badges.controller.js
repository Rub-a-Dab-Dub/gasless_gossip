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
exports.DegenBadgesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const degen_badge_response_dto_1 = require("../dto/degen-badge-response.dto");
let DegenBadgesController = class DegenBadgesController {
    degenBadgesService;
    constructor(degenBadgesService) {
        this.degenBadgesService = degenBadgesService;
    }
    async awardBadge(awardBadgeDto) {
        return this.degenBadgesService.awardBadge(awardBadgeDto);
    }
    async batchAwardBadges(batchAwardDto) {
        return this.degenBadgesService.batchAwardBadges(batchAwardDto);
    }
    async getUserBadges(userId) {
        return this.degenBadgesService.getUserBadges(userId);
    }
    async getUserBadgeStats(userId) {
        return this.degenBadgesService.getUserBadgeStats(userId);
    }
};
exports.DegenBadgesController = DegenBadgesController;
__decorate([
    (0, common_1.Post)("award"),
    (0, swagger_1.ApiOperation)({ summary: "Award a degen badge to a user" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Badge awarded successfully",
        type: degen_badge_response_dto_1.DegenBadgeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "User already has this badge" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DegenBadgesController.prototype, "awardBadge", null);
__decorate([
    (0, common_1.Post)("award/batch"),
    (0, swagger_1.ApiOperation)({ summary: "Award badges to multiple users" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Badges awarded successfully",
        type: [degen_badge_response_dto_1.DegenBadgeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], DegenBadgesController.prototype, "batchAwardBadges", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all badges for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User badges retrieved successfully',
        type: [degen_badge_response_dto_1.DegenBadgeResponseDto]
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DegenBadgesController.prototype, "getUserBadges", null);
__decorate([
    (0, common_1.Get)(':userId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get badge statistics for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User badge stats retrieved successfully',
        type: degen_badge_response_dto_1.DegenBadgeStatsDto
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DegenBadgesController.prototype, "getUserBadgeStats", null);
exports.DegenBadgesController = DegenBadgesController = __decorate([
    (0, swagger_1.ApiTags)("degen-badges"),
    (0, common_1.Controller)("degen-badges"),
    __metadata("design:paramtypes", [Function])
], DegenBadgesController);
//# sourceMappingURL=degen-badges.controller.js.map