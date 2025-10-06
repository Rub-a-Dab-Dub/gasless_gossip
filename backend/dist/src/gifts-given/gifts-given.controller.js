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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftsGivenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gifts_given_service_1 = require("./gifts-given.service");
const create_gift_log_dto_1 = require("./dto/create-gift-log.dto");
const gift_log_response_dto_1 = require("./dto/gift-log-response.dto");
const gift_history_query_dto_1 = require("./dto/gift-history-query.dto");
let GiftsGivenController = class GiftsGivenController {
    giftsGivenService;
    constructor(giftsGivenService) {
        this.giftsGivenService = giftsGivenService;
    }
    async logGift(createGiftLogDto) {
        return this.giftsGivenService.logGift(createGiftLogDto);
    }
    async getUserGiftHistory(userId, query) {
        return this.giftsGivenService.getUserGiftHistory(userId, query);
    }
    async getGiftAnalytics(userId) {
        return this.giftsGivenService.getGiftAnalytics(userId);
    }
};
exports.GiftsGivenController = GiftsGivenController;
__decorate([
    (0, common_1.Post)('log'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Log a gift that was sent' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Gift successfully logged',
        type: gift_log_response_dto_1.GiftLogResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_gift_log_dto_1.CreateGiftLogDto !== "undefined" && create_gift_log_dto_1.CreateGiftLogDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], GiftsGivenController.prototype, "logGift", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gift history for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift history retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof gift_history_query_dto_1.GiftHistoryQueryDto !== "undefined" && gift_history_query_dto_1.GiftHistoryQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], GiftsGivenController.prototype, "getUserGiftHistory", null);
__decorate([
    (0, common_1.Get)(':userId/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gift analytics for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Gift analytics retrieved successfully'
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftsGivenController.prototype, "getGiftAnalytics", null);
exports.GiftsGivenController = GiftsGivenController = __decorate([
    (0, swagger_1.ApiTags)('Gift History'),
    (0, common_1.Controller)('gifts-given'),
    __metadata("design:paramtypes", [gifts_given_service_1.GiftsGivenService])
], GiftsGivenController);
//# sourceMappingURL=gifts-given.controller.js.map