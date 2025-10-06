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
exports.MemecoinsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const memecoins_service_1 = require("../services/memecoins.service");
const create_drop_dto_1 = require("../dto/create-drop.dto");
const user_drops_dto_1 = require("../dto/user-drops.dto");
const drop_history_dto_1 = require("../dto/drop-history.dto");
let MemecoinsController = class MemecoinsController {
    memecoinsService;
    constructor(memecoinsService) {
        this.memecoinsService = memecoinsService;
    }
    async createDrop(createDropDto) {
        return await this.memecoinsService.createDrop(createDropDto);
    }
    async getUserDrops(userId, query) {
        return await this.memecoinsService.getUserDrops(userId, query.page, query.limit);
    }
    async getAllDrops(query) {
        return await this.memecoinsService.getAllDrops(query.page, query.limit);
    }
    async getDropById(id) {
        return await this.memecoinsService.getDropById(id);
    }
    async retryDrop(id) {
        return await this.memecoinsService.retryFailedDrop(id);
    }
};
exports.MemecoinsController = MemecoinsController;
__decorate([
    (0, common_1.Post)('drop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new memecoin drop' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Drop created and distributed successfully',
        type: drop_history_dto_1.DropHistoryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed or distribution error',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_drop_dto_1.CreateDropDto]),
    __metadata("design:returntype", Promise)
], MemecoinsController.prototype, "createDrop", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get memecoin drop history for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User wallet address or ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User drop history retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_drops_dto_1.GetUserDropsDto]),
    __metadata("design:returntype", Promise)
], MemecoinsController.prototype, "getUserDrops", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all memecoin drops with pagination' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All drops retrieved successfully',
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_drops_dto_1.GetUserDropsDto]),
    __metadata("design:returntype", Promise)
], MemecoinsController.prototype, "getAllDrops", null);
__decorate([
    (0, common_1.Get)('drop/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific drop by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Drop ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Drop retrieved successfully',
        type: drop_history_dto_1.DropHistoryDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Drop not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemecoinsController.prototype, "getDropById", null);
__decorate([
    (0, common_1.Post)('drop/:id/retry'),
    (0, swagger_1.ApiOperation)({ summary: 'Retry a failed drop' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Drop ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Drop retried successfully',
        type: drop_history_dto_1.DropHistoryDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemecoinsController.prototype, "retryDrop", null);
exports.MemecoinsController = MemecoinsController = __decorate([
    (0, swagger_1.ApiTags)('memecoins'),
    (0, common_1.Controller)('memecoins'),
    __metadata("design:paramtypes", [memecoins_service_1.MemecoinsService])
], MemecoinsController);
//# sourceMappingURL=memecoins.controller.js.map