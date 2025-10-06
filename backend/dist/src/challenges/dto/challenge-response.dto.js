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
exports.ChallengeStatsDto = exports.ChallengeParticipationResponseDto = exports.ChallengeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const challenge_entity_1 = require("../entities/challenge.entity");
const challenge_participation_entity_1 = require("../entities/challenge-participation.entity");
class ChallengeResponseDto {
    id;
    title;
    description;
    type;
    goal;
    reward;
    status;
    expiresAt;
    completedAt;
    createdBy;
    metadata;
    participantCount;
    completionCount;
    createdAt;
    updatedAt;
}
exports.ChallengeResponseDto = ChallengeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChallengeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChallengeResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ChallengeResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: challenge_entity_1.ChallengeType }),
    __metadata("design:type", String)
], ChallengeResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeResponseDto.prototype, "goal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeResponseDto.prototype, "reward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: challenge_entity_1.ChallengeStatus }),
    __metadata("design:type", String)
], ChallengeResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChallengeResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], ChallengeResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ChallengeResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ChallengeResponseDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeResponseDto.prototype, "participantCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeResponseDto.prototype, "completionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChallengeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChallengeResponseDto.prototype, "updatedAt", void 0);
class ChallengeParticipationResponseDto {
    id;
    userId;
    challengeId;
    status;
    progress;
    rewardEarned;
    completedAt;
    progressData;
    stellarTransactionId;
    createdAt;
    updatedAt;
}
exports.ChallengeParticipationResponseDto = ChallengeParticipationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChallengeParticipationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChallengeParticipationResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ChallengeParticipationResponseDto.prototype, "challengeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: challenge_participation_entity_1.ParticipationStatus }),
    __metadata("design:type", String)
], ChallengeParticipationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeParticipationResponseDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeParticipationResponseDto.prototype, "rewardEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], ChallengeParticipationResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ChallengeParticipationResponseDto.prototype, "progressData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ChallengeParticipationResponseDto.prototype, "stellarTransactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChallengeParticipationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ChallengeParticipationResponseDto.prototype, "updatedAt", void 0);
class ChallengeStatsDto {
    totalChallenges;
    activeChallenges;
    completedChallenges;
    totalRewardsEarned;
    participationRate;
}
exports.ChallengeStatsDto = ChallengeStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeStatsDto.prototype, "totalChallenges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeStatsDto.prototype, "activeChallenges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeStatsDto.prototype, "completedChallenges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeStatsDto.prototype, "totalRewardsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChallengeStatsDto.prototype, "participationRate", void 0);
//# sourceMappingURL=challenge-response.dto.js.map