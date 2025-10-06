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
exports.CreateReactionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const reaction_entity_1 = require("../entities/reaction.entity");
class CreateReactionDto {
    messageId;
    type;
}
exports.CreateReactionDto = CreateReactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the message to react to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(4, { message: 'Message ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReactionDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of reaction',
        enum: reaction_entity_1.ReactionType,
        example: reaction_entity_1.ReactionType.LIKE,
    }),
    (0, class_validator_1.IsEnum)(reaction_entity_1.ReactionType, {
        message: 'Reaction type must be one of the allowed types',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReactionDto.prototype, "type", void 0);
//# sourceMappingURL=create-reaction.dto.js.map