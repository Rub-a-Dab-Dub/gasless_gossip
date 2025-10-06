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
exports.ConnectWalletDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const wallet_connection_entity_1 = require("../entities/wallet-connection.entity");
class ConnectWalletDto {
    walletType;
    address;
    publicKey;
    signature;
    metadata;
}
exports.ConnectWalletDto = ConnectWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of wallet to connect',
        enum: wallet_connection_entity_1.WalletType,
        example: wallet_connection_entity_1.WalletType.ALBEDO
    }),
    (0, class_validator_1.IsEnum)(wallet_connection_entity_1.WalletType),
    __metadata("design:type", String)
], ConnectWalletDto.prototype, "walletType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stellar public key address',
        example: 'GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^G[0-9A-Z]{55}$/, {
        message: 'Invalid Stellar public key format'
    }),
    __metadata("design:type", String)
], ConnectWalletDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Public key for verification',
        required: false,
        example: 'GALPCCZN4YXA3YMJHKLGSHTPHQJ3L3X5D2J4QZJXK7N6VQZ3Y4I5L6M7N8O9P'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^G[0-9A-Z]{55}$/, {
        message: 'Invalid Stellar public key format'
    }),
    __metadata("design:type", String)
], ConnectWalletDto.prototype, "publicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Signature for wallet verification',
        required: false,
        example: 'base64-encoded-signature'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 1000),
    __metadata("design:type", String)
], ConnectWalletDto.prototype, "signature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional wallet metadata',
        required: false,
        example: { deviceInfo: 'mobile', version: '1.0.0' }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ConnectWalletDto.prototype, "metadata", void 0);
//# sourceMappingURL=connect-wallet.dto.js.map