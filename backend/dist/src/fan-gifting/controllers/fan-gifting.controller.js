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
exports.FanGiftingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fan_gifting_service_1 = require("../services/fan-gifting.service");
const create_fan_gift_dto_1 = require("../dto/create-fan-gift.dto");
const gift_history_query_dto_1 = require("../dto/gift-history-query.dto");
const fan_gift_response_dto_1 = require("../dto/fan-gift-response.dto");
let FanGiftingController = class FanGiftingController {
    fanGiftingService;
    constructor(fanGiftingService) {
        this.fanGiftingService = fanGiftingService;
    }
    async createGift(createGiftDto, req) {
        const fanId = req.user?.id || 'mock-fan-id';
        return await this.fanGiftingService.createGift(fanId, createGiftDto);
    }
    async getGiftHistory(userId, query) {
        return await this.fanGiftingService.getGiftHistory(userId, query);
    }
    async getGiftStats(userId) {
        return await this.fanGiftingService.getGiftStats(userId);
    }
    async getGiftById(giftId) {
        return await this.fanGiftingService.getGiftById(giftId);
    }
};
exports.FanGiftingController = FanGiftingController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a gift to a creator' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Gift sent successfully',
        type: fan_gift_response_dto_1.FanGiftResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid gift data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fan_gift_dto_1.CreateFanGiftDto, Object]),
    __metadata("design:returntype", Promise)
], FanGiftingController.prototype, "createGift", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gift history for a user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Gift history retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gift_history_query_dto_1.GiftHistoryQueryDto]),
    __metadata("design:returntype", Promise)
], FanGiftingController.prototype, "getGiftHistory", null);
__decorate([
    (0, common_1.Get)(':userId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gift statistics for a user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Gift statistics retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanGiftingController.prototype, "getGiftStats", null);
__decorate([
    (0, common_1.Get)('gift/:giftId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific gift details' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Gift details retrieved successfully',
        type: fan_gift_response_dto_1.FanGiftResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Gift not found' }),
    __param(0, (0, common_1.Param)('giftId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FanGiftingController.prototype, "getGiftById", null);
exports.FanGiftingController = FanGiftingController = __decorate([
    (0, swagger_1.ApiTags)('Fan Gifting'),
    (0, common_1.Controller)('fan-gifts'),
    __metadata("design:paramtypes", [fan_gifting_service_1.FanGiftingService])
], FanGiftingController);
//# sourceMappingURL=fan-gifting.controller.js.map