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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gift = exports.GiftRarity = exports.GiftType = void 0;
const typeorm_1 = require("typeorm");
const user_gift_entity_1 = require("./user-gift.entity");
var GiftType;
(function (GiftType) {
    GiftType["BADGE"] = "badge";
    GiftType["EMOJI"] = "emoji";
    GiftType["STICKER"] = "sticker";
    GiftType["ANIMATION"] = "animation";
})(GiftType || (exports.GiftType = GiftType = {}));
var GiftRarity;
(function (GiftRarity) {
    GiftRarity["COMMON"] = "common";
    GiftRarity["UNCOMMON"] = "uncommon";
    GiftRarity["RARE"] = "rare";
    GiftRarity["EPIC"] = "epic";
    GiftRarity["LEGENDARY"] = "legendary";
})(GiftRarity || (exports.GiftRarity = GiftRarity = {}));
let Gift = class Gift {
    id;
    name;
    type;
    description;
    rarity;
    totalMinted;
    maxSupply;
    minLevelRequired;
    animationConfig;
    metadata;
    isActive;
    isBattleReward;
    battleTier;
    createdAt;
    updatedAt;
    userGifts;
};
exports.Gift = Gift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Gift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Gift.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: GiftType }),
    __metadata("design:type", String)
], Gift.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Gift.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: GiftRarity, default: GiftRarity.COMMON }),
    __metadata("design:type", String)
], Gift.prototype, "rarity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Gift.prototype, "totalMinted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Gift.prototype, "maxSupply", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], Gift.prototype, "minLevelRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Gift.prototype, "animationConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Gift.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Gift.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Gift.prototype, "isBattleReward", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Gift.prototype, "battleTier", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Gift.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Gift.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_gift_entity_1.UserGift, (userGift) => userGift.gift),
    __metadata("design:type", Array)
], Gift.prototype, "userGifts", void 0);
exports.Gift = Gift = __decorate([
    (0, typeorm_1.Entity)("gifts")
], Gift);
//# sourceMappingURL=gift.entity.js.map