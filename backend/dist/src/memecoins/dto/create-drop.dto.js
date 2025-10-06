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
exports.CreateDropDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDropDto {
    recipients;
    amount;
    assetCode;
    dropType;
}
exports.CreateDropDto = CreateDropDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of recipient wallet addresses',
        example: ['GCKFBEIYTKP633RJWBRR6F4ZCACDQY7CXMOJSM47MXXRX5QVYLZQ7JGD']
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDropDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of memecoins to drop per recipient',
        example: 100.5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.0000001),
    __metadata("design:type", Number)
], CreateDropDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asset code for the memecoin',
        example: 'MEME',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDropDto.prototype, "assetCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of drop',
        example: 'reward',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['reward', 'airdrop', 'bonus']),
    __metadata("design:type", String)
], CreateDropDto.prototype, "dropType", void 0);
//# sourceMappingURL=create-drop.dto.js.map