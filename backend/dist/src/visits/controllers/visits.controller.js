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
exports.VisitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const visit_response_dto_1 = require("../dto/visit-response.dto");
const visit_stats_dto_1 = require("../dto/visit-stats.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let VisitsController = class VisitsController {
    visitsService;
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    async createVisit(createVisitDto, request) {
        if (!createVisitDto.ipAddress) {
            createVisitDto.ipAddress = request.ip || request.connection.remoteAddress;
        }
        if (!createVisitDto.userAgent) {
            createVisitDto.userAgent = request.headers["user-agent"];
        }
        if (!createVisitDto.referrer) {
            createVisitDto.referrer = request.headers.referer;
        }
        const visit = await this.visitsService.createVisit(createVisitDto);
        return {
            id: visit.id,
            roomId: visit.roomId,
            userId: visit.userId,
            createdAt: visit.createdAt,
            duration: visit.duration,
            user: visit.user
                ? {
                    id: visit.user.id,
                    username: visit.user.username,
                    pseudonym: visit.user.pseudonym,
                }
                : undefined,
        };
    }
    async getVisitsByRoom(roomId, limit, offset) {
        const visits = await this.visitsService.getVisitsByRoom(roomId, limit, offset);
        return visits.map((visit) => ({
            id: visit.id,
            roomId: visit.roomId,
            userId: visit.userId,
            createdAt: visit.createdAt,
            duration: visit.duration,
            user: visit.user
                ? {
                    id: visit.user.id,
                    username: visit.user.username,
                    pseudonym: visit.user.pseudonym,
                }
                : undefined,
        }));
    }
    async getVisitsByUser(userId, limit, offset) {
        const visits = await this.visitsService.getVisitsByUser(userId, limit, offset);
        return visits.map((visit) => ({
            id: visit.id,
            roomId: visit.roomId,
            userId: visit.userId,
            createdAt: visit.createdAt,
            duration: visit.duration,
        }));
    }
    async getVisitStats(roomId) {
        return this.visitsService.getVisitStats(roomId);
    }
    async getPopularRooms(limit) {
        return this.visitsService.getPopularRooms(limit);
    }
};
exports.VisitsController = VisitsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Log a room visit" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Visit logged successfully",
        type: visit_response_dto_1.VisitResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Invalid visit data",
    }),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "createVisit", null);
__decorate([
    (0, common_1.Get)("room/:roomId"),
    (0, swagger_1.ApiOperation)({ summary: "Get visits for a specific room" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Room visits retrieved successfully",
        type: [visit_response_dto_1.VisitResponseDto],
    }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number, description: "Number of visits to return" }),
    (0, swagger_1.ApiQuery)({ name: "offset", required: false, type: Number, description: "Number of visits to skip" }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('offset', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "getVisitsByRoom", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, swagger_1.ApiOperation)({ summary: "Get visits for a specific user" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User visits retrieved successfully",
        type: [visit_response_dto_1.VisitResponseDto],
    }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number, description: "Number of visits to return" }),
    (0, swagger_1.ApiQuery)({ name: "offset", required: false, type: Number, description: "Number of visits to skip" }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('offset', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "getVisitsByUser", null);
__decorate([
    (0, common_1.Get)('stats/:roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get visit statistics for a room' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Visit statistics retrieved successfully',
        type: visit_stats_dto_1.VisitStatsDto,
    }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "getVisitStats", null);
__decorate([
    (0, common_1.Get)('popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get most popular rooms by visit count' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Popular rooms retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of rooms to return' }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VisitsController.prototype, "getPopularRooms", null);
exports.VisitsController = VisitsController = __decorate([
    (0, swagger_1.ApiTags)("visits"),
    (0, common_1.Controller)("visits"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [Function])
], VisitsController);
//# sourceMappingURL=visits.controller.js.map