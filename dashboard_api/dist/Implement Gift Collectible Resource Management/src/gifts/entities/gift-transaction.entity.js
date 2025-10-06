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
exports.GiftTransaction = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
var TransactionType;
(function (TransactionType) {
    TransactionType["MINT"] = "mint";
    TransactionType["BURN"] = "burn";
    TransactionType["GIFT"] = "gift";
    TransactionType["TRADE"] = "trade";
    TransactionType["BATTLE_REWARD"] = "battle_reward";
    TransactionType["ADMIN_ASSIGN"] = "admin_assign";
    TransactionType["ADMIN_REVOKE"] = "admin_revoke";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let GiftTransaction = class GiftTransaction {
    id;
    giftId;
    type;
    fromUserId;
    toUserId;
    quantity;
    metadata;
    createdAt;
};
exports.GiftTransaction = GiftTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], GiftTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], GiftTransaction.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: TransactionType }),
    __metadata("design:type", String)
], GiftTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], GiftTransaction.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], GiftTransaction.prototype, "toUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], GiftTransaction.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], GiftTransaction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GiftTransaction.prototype, "createdAt", void 0);
exports.GiftTransaction = GiftTransaction = __decorate([
    (0, typeorm_1.Entity)("gift_transactions"),
    (0, typeorm_1.Index)(["giftId", "createdAt"]),
    (0, typeorm_1.Index)(["fromUserId", "createdAt"]),
    (0, typeorm_1.Index)(["toUserId", "createdAt"])
], GiftTransaction);
//# sourceMappingURL=gift-transaction.entity.js.map