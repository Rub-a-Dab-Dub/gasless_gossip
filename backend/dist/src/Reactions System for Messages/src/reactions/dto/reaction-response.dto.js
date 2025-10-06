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
exports.ReactionCountDto = exports.ReactionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const reaction_entity_1 = require("../entities/reaction.entity");
class ReactionResponseDto {
    id;
    messageId;
    type;
    userId;
    createdAt;
}
exports.ReactionResponseDto = ReactionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReactionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReactionResponseDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: reaction_entity_1.ReactionType }),
    __metadata("design:type", String)
], ReactionResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReactionResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ReactionResponseDto.prototype, "createdAt", void 0);
class ReactionCountDto {
    messageId;
    totalCount;
    countByType;
}
exports.ReactionCountDto = ReactionCountDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReactionCountDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionCountDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Count by reaction type',
        example: { like: 5, love: 2, laugh: 1 },
    }),
    __metadata("design:type", Object)
], ReactionCountDto.prototype, "countByType", void 0);
//# sourceMappingURL=reaction-response.dto.js.map