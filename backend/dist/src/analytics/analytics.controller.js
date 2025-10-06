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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const analytics_dto_1 = require("./analytics.dto");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async createAnalytic(createAnalyticDto) {
        return this.analyticsService.createAnalytic(createAnalyticDto);
    }
    async getUserAnalytics(userId, query) {
        return this.analyticsService.getUserAnalytics(userId, query);
    }
    async getRoomAnalytics(roomId, query) {
        return this.analyticsService.getRoomAnalytics(roomId, query);
    }
    async trackVisit(body) {
        return this.analyticsService.trackVisit(body.userId, body.roomId, body.metadata);
    }
    async trackTip(body) {
        return this.analyticsService.trackTip(body.userId, body.amount, body.roomId, body.metadata);
    }
    async trackReaction(body) {
        return this.analyticsService.trackReaction(body.userId, body.roomId, body.reactionType);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new analytics record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Analytics record created successfully' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.CreateAnalyticDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "createAnalytic", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics for a specific user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User analytics retrieved successfully', type: analytics_dto_1.AnalyticsResponseDto }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('room/:roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics for a specific room' }),
    (0, swagger_1.ApiParam)({ name: 'roomId', description: 'Room ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room analytics retrieved successfully', type: analytics_dto_1.AnalyticsResponseDto }),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, analytics_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRoomAnalytics", null);
__decorate([
    (0, common_1.Post)('track/visit'),
    (0, swagger_1.ApiOperation)({ summary: 'Track a visit' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackVisit", null);
__decorate([
    (0, common_1.Post)('track/tip'),
    (0, swagger_1.ApiOperation)({ summary: 'Track a tip' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackTip", null);
__decorate([
    (0, common_1.Post)('track/reaction'),
    (0, swagger_1.ApiOperation)({ summary: 'Track a reaction' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackReaction", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map