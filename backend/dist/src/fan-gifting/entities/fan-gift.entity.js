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
exports.FanGift = void 0;
const typeorm_1 = require("typeorm");
let FanGift = class FanGift {
    id;
    giftId;
    fanId;
    creatorId;
    txId;
    giftType;
    amount;
    stellarAsset;
    message;
    status;
    createdAt;
    updatedAt;
};
exports.FanGift = FanGift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FanGift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FanGift.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FanGift.prototype, "fanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], FanGift.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], FanGift.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], FanGift.prototype, "giftType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 7, default: 0 }),
    __metadata("design:type", String)
], FanGift.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 56 }),
    __metadata("design:type", String)
], FanGift.prototype, "stellarAsset", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FanGift.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'completed', 'failed'], default: 'pending' }),
    __metadata("design:type", String)
], FanGift.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FanGift.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FanGift.prototype, "updatedAt", void 0);
exports.FanGift = FanGift = __decorate([
    (0, typeorm_1.Entity)('fan_gifts'),
    (0, typeorm_1.Index)(['fanId', 'creatorId']),
    (0, typeorm_1.Index)(['creatorId']),
    (0, typeorm_1.Index)(['txId'], { unique: true })
], FanGift);
//# sourceMappingURL=fan-gift.entity.js.map