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
exports.ReactionUpdateDto = exports.MostReactedSecretsResponseDto = exports.ReactionTrackResponseDto = exports.ReactionMetricsFilterDto = exports.SortOrder = exports.ReactionType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "like";
    ReactionType["LOVE"] = "love";
    ReactionType["LAUGH"] = "laugh";
    ReactionType["ANGRY"] = "angry";
    ReactionType["SAD"] = "sad";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class ReactionMetricsFilterDto {
    dateFrom;
    dateTo;
    reactionType;
    limit = 10;
    offset = 0;
    sortOrder = SortOrder.DESC;
}
exports.ReactionMetricsFilterDto = ReactionMetricsFilterDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by date from' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReactionMetricsFilterDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by date to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReactionMetricsFilterDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ReactionType, description: 'Filter by reaction type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ReactionType),
    __metadata("design:type", String)
], ReactionMetricsFilterDto.prototype, "reactionType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 1, maximum: 100, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ReactionMetricsFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReactionMetricsFilterDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: SortOrder, default: SortOrder.DESC }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], ReactionMetricsFilterDto.prototype, "sortOrder", void 0);
const swagger_2 = require("@nestjs/swagger");
class ReactionTrackResponseDto {
    id;
    messageId;
    totalCount;
    likeCount;
    loveCount;
    laughCount;
    angryCount;
    sadCount;
    createdAt;
    updatedAt;
}
exports.ReactionTrackResponseDto = ReactionTrackResponseDto;
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", String)
], ReactionTrackResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", String)
], ReactionTrackResponseDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionTrackResponseDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionTrackResponseDto.prototype, "likeCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionTrackResponseDto.prototype, "loveCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionTrackResponseDto.prototype, "laughCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionTrackResponseDto.prototype, "angryCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], ReactionTrackResponseDto.prototype, "sadCount", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Date)
], ReactionTrackResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Date)
], ReactionTrackResponseDto.prototype, "updatedAt", void 0);
class MostReactedSecretsResponseDto {
    data;
    total;
    limit;
    offset;
}
exports.MostReactedSecretsResponseDto = MostReactedSecretsResponseDto;
__decorate([
    (0, swagger_2.ApiProperty)({ type: [ReactionTrackResponseDto] }),
    __metadata("design:type", Array)
], MostReactedSecretsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], MostReactedSecretsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], MostReactedSecretsResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], MostReactedSecretsResponseDto.prototype, "offset", void 0);
const class_validator_2 = require("class-validator");
class ReactionUpdateDto {
    messageId;
    reactionType;
    count = 1;
}
exports.ReactionUpdateDto = ReactionUpdateDto;
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_2.IsUUID)(),
    __metadata("design:type", String)
], ReactionUpdateDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ enum: ReactionType }),
    (0, class_validator_1.IsEnum)(ReactionType),
    __metadata("design:type", String)
], ReactionUpdateDto.prototype, "reactionType", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReactionUpdateDto.prototype, "count", void 0);
//# sourceMappingURL=reaction-metrics-filter.dto.js.map