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
exports.NftResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NftResponseDto {
    id;
    userId;
    metadata;
    txId;
    contractAddress;
    tokenId;
    stellarAssetCode;
    stellarAssetIssuer;
    transferLogs;
    mintPrice;
    currentOwner;
    rarityScore;
    collectionId;
    createdAt;
    updatedAt;
    constructor(nft) {
        this.id = nft.id;
        this.userId = nft.userId;
        this.metadata = nft.metadata;
        this.txId = nft.txId;
        this.contractAddress = nft.contractAddress;
        this.tokenId = nft.tokenId;
        this.stellarAssetCode = nft.stellarAssetCode;
        this.stellarAssetIssuer = nft.stellarAssetIssuer;
        this.transferLogs = nft.transferLogs;
        this.mintPrice = nft.mintPrice;
        this.currentOwner = nft.currentOwner;
        this.rarityScore = nft.rarityScore;
        this.collectionId = nft.collectionId;
        this.createdAt = nft.createdAt;
        this.updatedAt = nft.updatedAt;
    }
}
exports.NftResponseDto = NftResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "NFT unique identifier",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Owner user ID",
        example: "987fcdeb-51a2-43d1-9f12-345678901234",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "NFT metadata",
        example: {
            name: "Whisper Collectible #001",
            description: "A rare collectible from the Whisper universe",
            image: "https://example.com/nft-image.png",
            attributes: [
                { trait_type: "Background", value: "Blue" },
                { trait_type: "Rarity", value: "Legendary" },
            ],
        },
    }),
    __metadata("design:type", Object)
], NftResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Stellar transaction ID",
        example: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "txId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Smart contract address",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "contractAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Token ID within the contract",
        example: "WHISPER001ABC",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "tokenId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Stellar asset code",
        example: "WHISPER001",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "stellarAssetCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Stellar asset issuer",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "stellarAssetIssuer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Transfer history logs",
        example: [
            {
                from: "mint",
                to: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
                timestamp: "2024-01-15T10:30:00Z",
                transactionId: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
            },
        ],
    }),
    __metadata("design:type", Array)
], NftResponseDto.prototype, "transferLogs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Mint price in XLM",
        example: "10.5000000",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "mintPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Whether the user is the current owner",
        example: true,
    }),
    __metadata("design:type", Boolean)
], NftResponseDto.prototype, "currentOwner", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Calculated rarity score",
        example: 85.5,
    }),
    __metadata("design:type", Number)
], NftResponseDto.prototype, "rarityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Collection ID if part of a collection",
        example: "456e7890-e12b-34d5-a678-901234567890",
    }),
    __metadata("design:type", String)
], NftResponseDto.prototype, "collectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Creation timestamp",
        example: "2024-01-15T10:30:00Z",
    }),
    __metadata("design:type", Date)
], NftResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Last update timestamp",
        example: "2024-01-15T10:30:00Z",
    }),
    __metadata("design:type", Date)
], NftResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=nft-response.dto.js.map