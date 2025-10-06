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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const avatars_service_1 = require("./avatars.service");
const create_avatar_dto_1 = require("./dto/create-avatar.dto");
const avatar_response_dto_1 = require("./dto/avatar-response.dto");
let AvatarsController = class AvatarsController {
    avatarsService;
    constructor(avatarsService) {
        this.avatarsService = avatarsService;
    }
    async mintAvatar(createAvatarDto, req) {
        const userId = req.user?.id || req.user?.userId;
        const stellarPublicKey = req.user?.stellarPublicKey || req.body.stellarPublicKey;
        return this.avatarsService.mintAvatar(userId, createAvatarDto, stellarPublicKey);
    }
    async getAvatar(userId) {
        return this.avatarsService.getUserAvatar(userId);
    }
    async getAllAvatars() {
        return this.avatarsService.getAllAvatars();
    }
};
exports.AvatarsController = AvatarsController;
__decorate([
    (0, common_1.Post)('mint'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Mint a new NFT avatar for the authenticated user' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: create_avatar_dto_1.CreateAvatarDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Avatar successfully minted',
        type: avatar_response_dto_1.AvatarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'User already has an active avatar',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or Stellar transaction failed',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_avatar_dto_1.CreateAvatarDto !== "undefined" && create_avatar_dto_1.CreateAvatarDto) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "mintAvatar", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get avatar by user ID' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'User UUID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Avatar found',
        type: avatar_response_dto_1.AvatarResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Avatar not found',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all avatars' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all avatars',
        type: [avatar_response_dto_1.AvatarResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "getAllAvatars", null);
exports.AvatarsController = AvatarsController = __decorate([
    (0, swagger_1.ApiTags)('Avatars'),
    (0, common_1.Controller)('avatars'),
    __metadata("design:paramtypes", [avatars_service_1.AvatarsService])
], AvatarsController);
//# sourceMappingURL=avatars.controller.js.map