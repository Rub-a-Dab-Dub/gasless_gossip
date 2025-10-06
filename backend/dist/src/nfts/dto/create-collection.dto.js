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
exports.CreateCollectionDto = exports.CollectionMetadataDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CollectionMetadataDto {
    name;
    description;
    image;
    banner_image;
    external_link;
    seller_fee_basis_points;
    fee_recipient;
}
exports.CollectionMetadataDto = CollectionMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection name",
        example: "Whisper Legends",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CollectionMetadataDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection description",
        example: "A collection of legendary characters from the Whisper universe",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CollectionMetadataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection image URL",
        example: "https://example.com/collection-image.png",
    }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CollectionMetadataDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Collection banner image URL",
        example: "https://example.com/collection-banner.png",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CollectionMetadataDto.prototype, "banner_image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "External link for the collection",
        example: "https://whisper.com/collections/legends",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CollectionMetadataDto.prototype, "external_link", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Seller fee in basis points (100 = 1%)",
        example: 250,
        minimum: 0,
        maximum: 10000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CollectionMetadataDto.prototype, "seller_fee_basis_points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Fee recipient address",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionMetadataDto.prototype, "fee_recipient", void 0);
class CreateCollectionDto {
    name;
    symbol;
    description;
    metadata;
    maxSupply;
}
exports.CreateCollectionDto = CreateCollectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection name (must be unique)",
        example: "Whisper Legends",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection symbol (must be unique)",
        example: "WLEG",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim().toUpperCase()),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection description",
        example: "A collection of legendary characters from the Whisper universe",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Collection metadata",
        type: CollectionMetadataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CollectionMetadataDto),
    __metadata("design:type", CollectionMetadataDto)
], CreateCollectionDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Maximum supply of NFTs in this collection",
        example: 10000,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "maxSupply", void 0);
//# sourceMappingURL=create-collection.dto.js.map