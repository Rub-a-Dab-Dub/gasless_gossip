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
exports.SocialSharingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const social_sharing_service_1 = require("./social-sharing.service");
const create_share_dto_1 = require("./dto/create-share.dto");
const share_query_dto_1 = require("./dto/share-query.dto");
const create_share_dto_2 = require("./dto/create-share.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let SocialSharingController = class SocialSharingController {
    socialSharingService;
    constructor(socialSharingService) {
        this.socialSharingService = socialSharingService;
    }
    async createShare(createShareDto, user) {
        return this.socialSharingService.createShare(createShareDto, user.id);
    }
    async getSharesByUser(userId, query) {
        return this.socialSharingService.getSharesByUser(userId, query);
    }
    async getMyShares(user, query) {
        return this.socialSharingService.getSharesByUser(user.id, query);
    }
    async getAllShares(query) {
        return this.socialSharingService.getAllShares(query);
    }
    async getShareById(id) {
        return this.socialSharingService.getShareById(id);
    }
    async getShareStats() {
        return this.socialSharingService.getShareStats();
    }
    async getMyShareStats(user) {
        return this.socialSharingService.getShareStats(user.id);
    }
    async generateMockShare(contentType, user) {
        const mockContent = await this.socialSharingService.generateMockShareContent(contentType, user.id);
        return {
            ...mockContent,
            suggestedPlatforms: ['x', 'facebook', 'linkedin', 'discord'],
        };
    }
};
exports.SocialSharingController = SocialSharingController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new share' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Share created successfully',
        type: create_share_dto_2.ShareResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid share data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_share_dto_1.CreateShareDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "createShare", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shares by user ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User shares retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, share_query_dto_1.ShareQueryDto]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "getSharesByUser", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user shares' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User shares retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        share_query_dto_1.ShareQueryDto]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "getMyShares", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all shares with optional filters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shares retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'contentType', required: false, description: 'Filter by content type' }),
    (0, swagger_1.ApiQuery)({ name: 'platform', required: false, description: 'Filter by platform' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter by start date (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter by end date (ISO string)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of results to return (max 100)' }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Number of results to skip' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [share_query_dto_1.ShareQueryDto]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "getAllShares", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get share by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Share retrieved successfully',
        type: create_share_dto_2.ShareResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Share not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "getShareById", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall sharing statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "getShareStats", null);
__decorate([
    (0, common_1.Get)('stats/my'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user sharing statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "getMyShareStats", null);
__decorate([
    (0, common_1.Post)('mock/:contentType'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Generate mock share content for testing' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Mock share content generated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Param)('contentType')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SocialSharingController.prototype, "generateMockShare", null);
exports.SocialSharingController = SocialSharingController = __decorate([
    (0, swagger_1.ApiTags)('Social Sharing'),
    (0, common_1.Controller)('shares'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [social_sharing_service_1.SocialSharingService])
], SocialSharingController);
//# sourceMappingURL=social-sharing.controller.js.map