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
exports.TokenGiftTransaction = void 0;
const typeorm_1 = require("typeorm");
let TokenGiftTransaction = class TokenGiftTransaction {
    id;
    giftId;
    network;
    txHash;
    status;
    blockNumber;
    confirmations;
    gasUsed;
    gasPrice;
    effectiveGasPrice;
    transactionFee;
    sponsored;
    paymasterAddress;
    transactionData;
    receipt;
    errorMessage;
    createdAt;
};
exports.TokenGiftTransaction = TokenGiftTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "giftId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "network", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], TokenGiftTransaction.prototype, "confirmations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "gasUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "gasPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "effectiveGasPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "transactionFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TokenGiftTransaction.prototype, "sponsored", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "paymasterAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TokenGiftTransaction.prototype, "transactionData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TokenGiftTransaction.prototype, "receipt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TokenGiftTransaction.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TokenGiftTransaction.prototype, "createdAt", void 0);
exports.TokenGiftTransaction = TokenGiftTransaction = __decorate([
    (0, typeorm_1.Entity)('token_gift_transactions'),
    (0, typeorm_1.Index)(['giftId', 'createdAt']),
    (0, typeorm_1.Index)(['network', 'createdAt']),
    (0, typeorm_1.Index)(['txHash', 'network'])
], TokenGiftTransaction);
//# sourceMappingURL=token-gift-transaction.entity.js.map