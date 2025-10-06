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
exports.GiftsController = void 0;
const common_1 = require("@nestjs/common");
const gifts_service_1 = require("./gifts.service");
const send_gift_dto_1 = require("./dto/send-gift.dto");
let GiftsController = class GiftsController {
    giftsService;
    constructor(giftsService) {
        this.giftsService = giftsService;
    }
    async sendGift(req, dto) {
        const senderId = 'mock-user-id';
        return this.giftsService.sendGift(senderId, dto);
    }
    async getGifts(userId) {
        return this.giftsService.getGiftsForUser(userId);
    }
};
exports.GiftsController = GiftsController;
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_gift_dto_1.SendGiftDto]),
    __metadata("design:returntype", Promise)
], GiftsController.prototype, "sendGift", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GiftsController.prototype, "getGifts", null);
exports.GiftsController = GiftsController = __decorate([
    (0, common_1.Controller)('gifts'),
    __metadata("design:paramtypes", [gifts_service_1.GiftsService])
], GiftsController);
//# sourceMappingURL=gifts.controller.js.map