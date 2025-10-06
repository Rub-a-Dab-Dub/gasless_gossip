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
exports.CreateChallengeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const challenge_entity_1 = require("../entities/challenge.entity");
class CreateChallengeDto {
    title;
    description;
    type;
    goal;
    reward;
    expiresAt;
    metadata;
}
exports.CreateChallengeDto = CreateChallengeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge title',
        example: 'Send 10 Gifts',
        maxLength: 200
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge description',
        example: 'Send 10 gifts to other users to complete this challenge',
        required: false,
        maxLength: 1000
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of challenge',
        enum: challenge_entity_1.ChallengeType,
        example: challenge_entity_1.ChallengeType.GIFT_SENDING
    }),
    (0, class_validator_1.IsEnum)(challenge_entity_1.ChallengeType),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Goal number to achieve',
        example: 10,
        minimum: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateChallengeDto.prototype, "goal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reward amount in Stellar tokens',
        example: 5.5,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateChallengeDto.prototype, "reward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge expiration date',
        example: '2024-12-31T23:59:59Z'
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional challenge metadata',
        required: false,
        example: { difficulty: 'medium', category: 'social' }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateChallengeDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-challenge.dto.js.map