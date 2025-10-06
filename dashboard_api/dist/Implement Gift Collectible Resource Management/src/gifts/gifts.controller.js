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
const create_gift_dto_1 = require("./dto/create-gift.dto");
const update_gift_dto_1 = require("./dto/update-gift.dto");
const assign_gift_dto_1 = require("./dto/assign-gift.dto");
const gift_user_dto_1 = require("./dto/gift-user.dto");
const battle_reward_dto_1 = require("./dto/battle-reward.dto");
let GiftsController = class GiftsController {
    giftsService;
    constructor(giftsService) {
        this.giftsService = giftsService;
    }
    mint(createGiftDto) {
        return this.giftsService.mintGift(createGiftDto);
    }
    findAll(type, rarity, isActive) {
        return this.giftsService.findAll({
            type,
            rarity,
            isActive: isActive === "true",
        });
    }
    getLowStockAlerts() {
        return this.giftsService.checkLowStockAlerts();
    }
    getGiftingPatterns(giftId) {
        return this.giftsService.getGiftingPatterns(giftId);
    }
    getUserInventory(userId) {
        return this.giftsService.getUserInventory(userId);
    }
    findOne(id) {
        return this.giftsService.findOne(id);
    }
    update(id, updateGiftDto) {
        return this.giftsService.update(id, updateGiftDto);
    }
    assign(assignDto) {
        const adminId = "temp-admin-id";
        return this.giftsService.assignGift(assignDto, adminId);
    }
    revoke(body) {
        const adminId = "temp-admin-id";
        return this.giftsService.revokeGift(body.userId, body.giftId, body.quantity, adminId);
    }
    giftToUser(giftDto) {
        return this.giftsService.giftToUser(giftDto);
    }
    battleReward(battleDto) {
        return this.giftsService.autoAwardBattleWinner(battleDto);
    }
    burn(id) {
        return this.giftsService.burnGift(id);
    }
};
exports.GiftsController = GiftsController;
__decorate([
    (0, common_1.Post)("mint"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gift_dto_1.CreateGiftDto]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "mint", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("type")),
    __param(1, (0, common_1.Query)("rarity")),
    __param(2, (0, common_1.Query)("isActive")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("low-stock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "getLowStockAlerts", null);
__decorate([
    (0, common_1.Get)("patterns"),
    __param(0, (0, common_1.Query)("giftId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "getGiftingPatterns", null);
__decorate([
    (0, common_1.Get)("inventory/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "getUserInventory", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_gift_dto_1.UpdateGiftDto]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("assign"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_gift_dto_1.AssignGiftDto]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)("revoke"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "revoke", null);
__decorate([
    (0, common_1.Post)("gift"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gift_user_dto_1.GiftUserDto]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "giftToUser", null);
__decorate([
    (0, common_1.Post)("battle-reward"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [battle_reward_dto_1.BattleRewardDto]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "battleReward", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GiftsController.prototype, "burn", null);
exports.GiftsController = GiftsController = __decorate([
    (0, common_1.Controller)("gifts"),
    __metadata("design:paramtypes", [gifts_service_1.GiftsService])
], GiftsController);
//# sourceMappingURL=gifts.controller.js.map