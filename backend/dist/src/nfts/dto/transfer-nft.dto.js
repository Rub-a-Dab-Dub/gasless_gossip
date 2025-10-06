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
exports.TransferNftDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TransferNftDto {
    nftId;
    toUserId;
    toStellarAddress;
}
exports.TransferNftDto = TransferNftDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "ID of the NFT to transfer",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferNftDto.prototype, "nftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "ID of the user to transfer the NFT to",
        example: "987fcdeb-51a2-43d1-9f12-345678901234",
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferNftDto.prototype, "toUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Stellar address of the recipient",
        example: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferNftDto.prototype, "toStellarAddress", void 0);
//# sourceMappingURL=transfer-nft.dto.js.map