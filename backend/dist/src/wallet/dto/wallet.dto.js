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
exports.GetBalanceDto = exports.RefreshBalanceDto = exports.WalletStatsDto = exports.PriceDataDto = exports.AssetBalanceDto = exports.NetworkBalanceDto = exports.WalletSummaryDto = exports.WalletBalanceDto = void 0;
const class_validator_1 = require("class-validator");
class WalletBalanceDto {
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
}
exports.WalletBalanceDto = WalletBalanceDto;
class WalletSummaryDto {
    userId;
    totalUsdValue;
    networks;
    assets;
    lastUpdated;
    cacheHit;
    responseTime;
}
exports.WalletSummaryDto = WalletSummaryDto;
class NetworkBalanceDto {
    network;
    totalUsdValue;
    nativeBalance;
    tokenCount;
    assets;
    lastUpdated;
}
exports.NetworkBalanceDto = NetworkBalanceDto;
class AssetBalanceDto {
    asset;
    symbol;
    balance;
    formattedBalance;
    usdValue;
    priceUsd;
    network;
    contractAddress;
    decimals;
    assetType;
    isStaking;
    stakingRewards;
    metadata;
    tokenInfo;
}
exports.AssetBalanceDto = AssetBalanceDto;
class PriceDataDto {
    asset;
    symbol;
    priceUsd;
    priceSource;
    lastUpdated;
    change24h;
    marketCap;
    volume24h;
}
exports.PriceDataDto = PriceDataDto;
class WalletStatsDto {
    totalUsers;
    totalAssets;
    totalUsdValue;
    networks;
    topAssets;
    cacheStats;
}
exports.WalletStatsDto = WalletStatsDto;
class RefreshBalanceDto {
    networks;
    assets;
    forceRefresh;
}
exports.RefreshBalanceDto = RefreshBalanceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RefreshBalanceDto.prototype, "networks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RefreshBalanceDto.prototype, "assets", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RefreshBalanceDto.prototype, "forceRefresh", void 0);
class GetBalanceDto {
    networks;
    assets;
    includePrices;
    includeMetadata;
}
exports.GetBalanceDto = GetBalanceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetBalanceDto.prototype, "networks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetBalanceDto.prototype, "assets", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetBalanceDto.prototype, "includePrices", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetBalanceDto.prototype, "includeMetadata", void 0);
//# sourceMappingURL=wallet.dto.js.map