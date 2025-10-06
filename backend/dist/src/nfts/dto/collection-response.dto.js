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
exports.CollectionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CollectionResponseDto {
    id;
    name;
    symbol;
    description;
    metadata;
    contractAddress;
    creatorAddress;
    totalSupply;
    maxSupply;
    floorPrice;
    isVerified;
    createdAt;
    updatedAt;
    constructor(collection) {
        this.id = collection.id;
        this.name = collection.name;
        this.symbol = collection.symbol;
        this.description = collection.description;
        this.metadata = collection.metadata;
        this.contractAddress = collection.contractAddress;
        this.creatorAddress = collection.creatorAddress;
        this.totalSupply = collection.totalSupply;
        this.maxSupply = collection.maxSupply;
        this.floorPrice = collection.floorPrice;
        this.isVerified = collection.isVerified;
        this.createdAt = collection.createdAt;
        this.updatedAt = collection.updatedAt;
    }
}
exports.CollectionResponseDto = CollectionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection unique identifier",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection name",
        example: "Whisper Legends",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection symbol",
        example: "WLEG",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection description",
        example: "A collection of legendary characters from the Whisper universe",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection metadata",
    }),
    __metadata("design:type", Object)
], CollectionResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Smart contract address",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "contractAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Creator address",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "creatorAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Total number of minted NFTs",
        example: 150,
    }),
    __metadata("design:type", Number)
], CollectionResponseDto.prototype, "totalSupply", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Maximum supply of NFTs",
        example: 10000,
    }),
    __metadata("design:type", Number)
], CollectionResponseDto.prototype, "maxSupply", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Floor price in XLM",
        example: "5.0000000",
    }),
    __metadata("design:type", String)
], CollectionResponseDto.prototype, "floorPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Whether the collection is verified",
        example: true,
    }),
    __metadata("design:type", Boolean)
], CollectionResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Creation timestamp",
        example: "2024-01-15T10:30:00Z",
    }),
    __metadata("design:type", Date)
], CollectionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Last update timestamp",
        example: "2024-01-15T10:30:00Z",
    }),
    __metadata("design:type", Date)
], CollectionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=collection-response.dto.js.map