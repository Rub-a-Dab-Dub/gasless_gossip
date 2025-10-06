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
exports.ChallengesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const challenges_service_1 = require("./services/challenges.service");
const create_challenge_dto_1 = require("./dto/create-challenge.dto");
const join_challenge_dto_1 = require("./dto/join-challenge.dto");
const challenge_response_dto_1 = require("./dto/challenge-response.dto");
const auth_guard_1 = require("../auth/auth.guard");
let ChallengesController = class ChallengesController {
    challengesService;
    constructor(challengesService) {
        this.challengesService = challengesService;
    }
    async createChallenge(req, createChallengeDto) {
        const createdBy = req.user.sub;
        return await this.challengesService.createChallenge(createChallengeDto, createdBy);
    }
    async getChallenges(activeOnly) {
        if (activeOnly === 'true') {
            return await this.challengesService.getActiveChallenges();
        }
        return await this.challengesService.getAllChallenges();
    }
    async getChallengeStats() {
        return await this.challengesService.getChallengeStats();
    }
    async getUserChallenges(req) {
        const userId = req.user.sub;
        return await this.challengesService.getUserChallenges(userId);
    }
    async getChallengeById(id) {
        return await this.challengesService.getChallengeById(id);
    }
    async joinChallenge(req, joinChallengeDto) {
        const userId = req.user.sub;
        return await this.challengesService.joinChallenge(userId, joinChallengeDto);
    }
    async updateProgress(req, progressUpdate) {
        const userId = req.user.sub;
        return await this.challengesService.updateProgress({
            userId,
            challengeId: progressUpdate.challengeId,
            progress: progressUpdate.progress,
            progressData: progressUpdate.progressData
        });
    }
};
exports.ChallengesController = ChallengesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new challenge' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Challenge created successfully',
        type: challenge_response_dto_1.ChallengeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid challenge data',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_challenge_dto_1.CreateChallengeDto]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "createChallenge", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenges' }),
    (0, swagger_1.ApiQuery)({ name: 'active', required: false, description: 'Filter active challenges only' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Challenges retrieved successfully',
        type: [challenge_response_dto_1.ChallengeResponseDto],
    }),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "getChallenges", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenge statistics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Challenge stats retrieved successfully',
        type: challenge_response_dto_1.ChallengeStatsDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "getChallengeStats", null);
__decorate([
    (0, common_1.Get)('my-challenges'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user challenges' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User challenges retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "getUserChallenges", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific challenge details' }),
    ApiParam({ name: 'id', description: 'Challenge ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Challenge details retrieved successfully',
        type: challenge_response_dto_1.ChallengeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Challenge not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "getChallengeById", null);
__decorate([
    (0, common_1.Post)('join'),
    (0, swagger_1.ApiOperation)({ summary: 'Join a challenge' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Successfully joined challenge',
        type: challenge_response_dto_1.ChallengeParticipationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Challenge is no longer active or invalid data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'User has already joined this challenge',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Challenge not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, join_challenge_dto_1.JoinChallengeDto]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "joinChallenge", null);
__decorate([
    (0, common_1.Post)('progress'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update challenge progress' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Progress updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid progress data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Participation not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "updateProgress", null);
exports.ChallengesController = ChallengesController = __decorate([
    (0, swagger_1.ApiTags)('challenges'),
    (0, common_1.Controller)('challenges'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [challenges_service_1.ChallengesService])
], ChallengesController);
//# sourceMappingURL=challenges.controller.js.map