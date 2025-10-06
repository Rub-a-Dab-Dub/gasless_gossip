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
exports.ActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_log_response_dto_1 = require("../dto/activity-log-response.dto");
const activity_stats_dto_1 = require("../dto/activity-stats.dto");
const activity_log_entity_1 = require("../entities/activity-log.entity");
let ActivityLogsController = class ActivityLogsController {
    activityLogsService;
    constructor(activityLogsService) {
        this.activityLogsService = activityLogsService;
    }
    async logActivity(createActivityLogDto, req) {
        if (!createActivityLogDto.ipAddress) {
            createActivityLogDto.ipAddress = req.ip || req.connection.remoteAddress;
        }
        if (!createActivityLogDto.userAgent) {
            createActivityLogDto.userAgent = req.get("User-Agent");
        }
        const activity = await this.activityLogsService.logActivity(createActivityLogDto);
        return activity;
    }
    async getUserActivities(userId, queryDto) {
        return this.activityLogsService.getUserActivities(userId, queryDto);
    }
    async getUserActivityStats(userId) {
        return this.activityLogsService.getUserActivityStats(userId);
    }
    async getRecentActivities(limit) {
        const limitNum = Number.parseInt(limit) || 50;
        return this.activityLogsService.getRecentActivities(limitNum);
    }
    async getActivitiesByAction(action, limit) {
        const limitNum = Number.parseInt(limit) || 50;
        return this.activityLogsService.getActivitiesByAction(action, limitNum);
    }
    async getActivityAggregates(startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.activityLogsService.getActivityAggregates(start, end);
    }
};
exports.ActivityLogsController = ActivityLogsController;
__decorate([
    (0, common_1.Post)("log"),
    (0, swagger_1.ApiOperation)({ summary: "Log a user activity" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Activity logged successfully",
        type: activity_log_response_dto_1.ActivityLogResponseDto,
    }),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "logActivity", null);
__decorate([
    (0, common_1.Get)(":userId"),
    (0, swagger_1.ApiOperation)({ summary: "Get user activity history" }),
    (0, swagger_1.ApiParam)({ name: "userId", description: "User ID" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "User activities retrieved successfully",
        type: [activity_log_response_dto_1.ActivityLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getUserActivities", null);
__decorate([
    (0, common_1.Get)(':userId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activity statistics' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User activity statistics retrieved successfully',
        type: activity_stats_dto_1.ActivityStatsDto,
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getUserActivityStats", null);
__decorate([
    (0, common_1.Get)('recent/:limit'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent activities across all users' }),
    (0, swagger_1.ApiParam)({ name: 'limit', description: 'Number of activities to retrieve' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Recent activities retrieved successfully',
        type: [activity_log_response_dto_1.ActivityLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getRecentActivities", null);
__decorate([
    (0, common_1.Get)("action/:action"),
    (0, swagger_1.ApiOperation)({ summary: "Get activities by action type" }),
    (0, swagger_1.ApiParam)({ name: "action", enum: activity_log_entity_1.ActivityAction, description: "Activity action type" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Activities by action retrieved successfully",
        type: [activity_log_response_dto_1.ActivityLogResponseDto],
    }),
    __param(0, (0, common_1.Param)('action')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getActivitiesByAction", null);
__decorate([
    (0, common_1.Get)("aggregates/summary"),
    (0, swagger_1.ApiOperation)({ summary: "Get activity aggregates and analytics" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Activity aggregates retrieved successfully",
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getActivityAggregates", null);
exports.ActivityLogsController = ActivityLogsController = __decorate([
    (0, swagger_1.ApiTags)("Activity Logs"),
    (0, common_1.Controller)("activity"),
    __metadata("design:paramtypes", [Function])
], ActivityLogsController);
//# sourceMappingURL=activity-logs.controller.js.map