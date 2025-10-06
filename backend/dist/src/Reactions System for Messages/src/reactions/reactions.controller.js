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
exports.ReactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reactions_service_1 = require("./reactions.service");
const create_reaction_dto_1 = require("./dto/create-reaction.dto");
const reaction_response_dto_1 = require("./dto/reaction-response.dto");
let ReactionsController = class ReactionsController {
    reactionsService;
    constructor(reactionsService) {
        this.reactionsService = reactionsService;
    }
    async createReaction(createReactionDto, req) {
        const userId = req.user?.id || 'user-123';
        return this.reactionsService.createReaction(createReactionDto, userId);
    }
    async getReactionsByMessage(messageId, req) {
        const userId = req.user?.id || 'user-123';
        return this.reactionsService.getReactionsByMessage(messageId, userId);
    }
    async getUserReaction(messageId, req) {
        const userId = req.user?.id || 'user-123';
        return this.reactionsService.getUserReactionForMessage(messageId, userId);
    }
    async removeReaction(messageId, req) {
        const userId = req.user?.id || 'user-123';
        return this.reactionsService.removeReaction(messageId, userId);
    }
    async getReactionStats() {
        return this.reactionsService.getReactionStats();
    }
};
exports.ReactionsController = ReactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update a reaction to a message' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Reaction created successfully',
        type: reaction_response_dto_1.ReactionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No access to message' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Duplicate reaction' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reaction_dto_1.CreateReactionDto, Object]),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "createReaction", null);
__decorate([
    (0, common_1.Get)(':messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reactions for a message' }),
    (0, swagger_1.ApiParam)({
        name: 'messageId',
        description: 'UUID of the message',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reactions retrieved successfully',
        type: reaction_response_dto_1.ReactionCountDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No access to message' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "getReactionsByMessage", null);
__decorate([
    (0, common_1.Get)(':messageId/my-reaction'),
    (0, swagger_1.ApiOperation)({ summary: "Get current user's reaction to a message" }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'UUID of the message' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User reaction retrieved',
        type: reaction_response_dto_1.ReactionResponseDto,
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "getUserReaction", null);
__decorate([
    (0, common_1.Delete)(':messageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: "Remove user's reaction from a message" }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'UUID of the message' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Reaction removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reaction not found' }),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "removeReaction", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reaction statistics (admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReactionsController.prototype, "getReactionStats", null);
exports.ReactionsController = ReactionsController = __decorate([
    (0, swagger_1.ApiTags)('reactions'),
    (0, common_1.Controller)('reactions'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reactions_service_1.ReactionsService])
], ReactionsController);
//# sourceMappingURL=reactions.controller.js.map