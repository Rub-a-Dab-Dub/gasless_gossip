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
exports.ChallengeParticipation = exports.ParticipationStatus = void 0;
const typeorm_1 = require("typeorm");
const challenge_entity_1 = require("./challenge.entity");
var ParticipationStatus;
(function (ParticipationStatus) {
    ParticipationStatus["ACTIVE"] = "active";
    ParticipationStatus["COMPLETED"] = "completed";
    ParticipationStatus["FAILED"] = "failed";
    ParticipationStatus["ABANDONED"] = "abandoned";
})(ParticipationStatus || (exports.ParticipationStatus = ParticipationStatus = {}));
let ChallengeParticipation = class ChallengeParticipation {
    id;
    userId;
    challengeId;
    status;
    progress;
    rewardEarned;
    completedAt;
    progressData;
    stellarTransactionId;
    challenge;
    createdAt;
    updatedAt;
};
exports.ChallengeParticipation = ChallengeParticipation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChallengeParticipation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ChallengeParticipation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], ChallengeParticipation.prototype, "challengeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ParticipationStatus,
        default: ParticipationStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], ChallengeParticipation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], ChallengeParticipation.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, default: 0 }),
    __metadata("design:type", Number)
], ChallengeParticipation.prototype, "rewardEarned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ChallengeParticipation.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ChallengeParticipation.prototype, "progressData", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], ChallengeParticipation.prototype, "stellarTransactionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => challenge_entity_1.Challenge, (challenge) => challenge.participations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'challengeId' }),
    __metadata("design:type", challenge_entity_1.Challenge)
], ChallengeParticipation.prototype, "challenge", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChallengeParticipation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ChallengeParticipation.prototype, "updatedAt", void 0);
exports.ChallengeParticipation = ChallengeParticipation = __decorate([
    (0, typeorm_1.Entity)('challenge_participations'),
    (0, typeorm_1.Unique)(['userId', 'challengeId']),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['challengeId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['completedAt'])
], ChallengeParticipation);
//# sourceMappingURL=challenge-participation.entity.js.map