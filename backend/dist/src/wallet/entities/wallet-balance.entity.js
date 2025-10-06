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
exports.WalletBalance = void 0;
const typeorm_1 = require("typeorm");
let WalletBalance = class WalletBalance {
    id;
    userId;
    network;
    asset;
    contractAddress;
    balance;
    formattedBalance;
    symbol;
    decimals;
    assetType;
    walletAddress;
    usdValue;
    priceUsd;
    priceSource;
    isStaking;
    stakingRewards;
    metadata;
    tokenInfo;
    lastFetchedAt;
    expiresAt;
    createdAt;
    updatedAt;
};
exports.WalletBalance = WalletBalance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletBalance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], WalletBalance.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], WalletBalance.prototype, "network", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], WalletBalance.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "contractAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 36, scale: 18 }),
    __metadata("design:type", String)
], WalletBalance.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 36, scale: 18 }),
    __metadata("design:type", String)
], WalletBalance.prototype, "formattedBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], WalletBalance.prototype, "decimals", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "usdValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "priceUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "priceSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], WalletBalance.prototype, "isStaking", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", String)
], WalletBalance.prototype, "stakingRewards", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WalletBalance.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WalletBalance.prototype, "tokenInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], WalletBalance.prototype, "lastFetchedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], WalletBalance.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WalletBalance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WalletBalance.prototype, "updatedAt", void 0);
exports.WalletBalance = WalletBalance = __decorate([
    (0, typeorm_1.Entity)('wallet_balances'),
    (0, typeorm_1.Index)(['userId', 'network', 'createdAt']),
    (0, typeorm_1.Index)(['userId', 'asset', 'createdAt']),
    (0, typeorm_1.Index)(['network', 'asset', 'createdAt']),
    (0, typeorm_1.Index)(['userId', 'network', 'asset'])
], WalletBalance);
//# sourceMappingURL=wallet-balance.entity.js.map