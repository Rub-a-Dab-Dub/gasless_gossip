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
exports.CreateNftDto = exports.NftMetadataDto = exports.NftAttributeDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class NftAttributeDto {
    trait_type;
    value;
}
exports.NftAttributeDto = NftAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The trait type/category",
        example: "Background",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NftAttributeDto.prototype, "trait_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The trait value",
        example: "Blue",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], NftAttributeDto.prototype, "value", void 0);
class NftMetadataDto {
    name;
    description;
    image;
    attributes;
    external_url;
    animation_url;
    background_color;
}
exports.NftMetadataDto = NftMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Name of the NFT",
        example: "Whisper Collectible #001",
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], NftMetadataDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Description of the NFT",
        example: "A rare collectible from the Whisper universe",
        maxLength: 1000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], NftMetadataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "URL to the NFT image",
        example: "https://example.com/nft-image.png",
    }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], NftMetadataDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Array of NFT attributes/traits",
        type: [NftAttributeDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NftAttributeDto),
    __metadata("design:type", Array)
], NftMetadataDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "External URL for more information",
        example: "https://whisper.com/collectibles/001",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], NftMetadataDto.prototype, "external_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "URL to animation/video file",
        example: "https://example.com/nft-animation.mp4",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], NftMetadataDto.prototype, "animation_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Background color as hex code (without #)",
        example: "FF0000",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NftMetadataDto.prototype, "background_color", void 0);
class CreateNftDto {
    metadata;
    recipientStellarAddress;
    collectionId;
    mintPrice;
}
exports.CreateNftDto = CreateNftDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "NFT metadata following OpenSea standards",
        type: NftMetadataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => NftMetadataDto),
    __metadata("design:type", NftMetadataDto)
], CreateNftDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Stellar address to receive the NFT (defaults to user's address)",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNftDto.prototype, "recipientStellarAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Collection ID to associate this NFT with",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNftDto.prototype, "collectionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: "Mint price in XLM",
        example: "10.5000000",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: "0,7" }),
    __metadata("design:type", String)
], CreateNftDto.prototype, "mintPrice", void 0);
//# sourceMappingURL=create-nft.dto.js.map