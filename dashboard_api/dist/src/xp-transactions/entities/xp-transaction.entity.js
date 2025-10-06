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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPTransaction = exports.TransactionStatus = exports.ActionType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ActionType;
(function (ActionType) {
    ActionType["MESSAGE"] = "message";
    ActionType["REACTION"] = "reaction";
    ActionType["GIFT"] = "gift";
    ActionType["TOKEN_SEND"] = "token_send";
    ActionType["SECRET_SHARE"] = "secret_share";
    ActionType["MANUAL_AWARD"] = "manual_award";
    ActionType["ADJUSTMENT"] = "adjustment";
})(ActionType || (exports.ActionType = ActionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["ACTIVE"] = "active";
    TransactionStatus["VOIDED"] = "voided";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
let XPTransaction = class XPTransaction {
    id;
    userId;
    user;
    actionType;
    amount;
    multiplier;
    finalAmount;
    status;
    reason;
    transactionId;
    adjustedBy;
    voidedBy;
    voidReason;
    createdAt;
    updatedAt;
    metadata;
};
exports.XPTransaction = XPTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], XPTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XPTransaction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], XPTransaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ActionType }),
    __metadata("design:type", String)
], XPTransaction.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], XPTransaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], XPTransaction.prototype, "multiplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], XPTransaction.prototype, "finalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.ACTIVE }),
    __metadata("design:type", String)
], XPTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], XPTransaction.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], XPTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], XPTransaction.prototype, "adjustedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], XPTransaction.prototype, "voidedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], XPTransaction.prototype, "voidReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], XPTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], XPTransaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], XPTransaction.prototype, "metadata", void 0);
exports.XPTransaction = XPTransaction = __decorate([
    (0, typeorm_1.Entity)('xp_transactions'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['actionType', 'createdAt']),
    (0, typeorm_1.Index)(['status', 'createdAt']),
    (0, typeorm_1.Index)(['amount'])
], XPTransaction);
//# sourceMappingURL=xp-transaction.entity.js.map