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
exports.Challenge = exports.ChallengeType = exports.ChallengeStatus = void 0;
const typeorm_1 = require("typeorm");
const challenge_participation_entity_1 = require("./challenge-participation.entity");
var ChallengeStatus;
(function (ChallengeStatus) {
    ChallengeStatus["ACTIVE"] = "active";
    ChallengeStatus["COMPLETED"] = "completed";
    ChallengeStatus["EXPIRED"] = "expired";
    ChallengeStatus["CANCELLED"] = "cancelled";
})(ChallengeStatus || (exports.ChallengeStatus = ChallengeStatus = {}));
var ChallengeType;
(function (ChallengeType) {
    ChallengeType["GIFT_SENDING"] = "gift_sending";
    ChallengeType["MESSAGE_COUNT"] = "message_count";
    ChallengeType["XP_GAIN"] = "xp_gain";
    ChallengeType["TOKEN_TRANSFER"] = "token_transfer";
    ChallengeType["REFERRAL"] = "referral";
    ChallengeType["CUSTOM"] = "custom";
})(ChallengeType || (exports.ChallengeType = ChallengeType = {}));
let Challenge = class Challenge {
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
    participations;
    createdAt;
    updatedAt;
};
exports.Challenge = Challenge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Challenge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Challenge.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], Challenge.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChallengeType
    }),
    __metadata("design:type", String)
], Challenge.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Challenge.prototype, "goal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ChallengeStatus,
        default: ChallengeStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Challenge.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Challenge.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Challenge.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Challenge.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "participantCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "completionCount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => challenge_participation_entity_1.ChallengeParticipation, (participation) => participation.challenge),
    __metadata("design:type", Array)
], Challenge.prototype, "participations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Challenge.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Challenge.prototype, "updatedAt", void 0);
exports.Challenge = Challenge = __decorate([
    (0, typeorm_1.Entity)('challenges'),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['type']),
    (0, typeorm_1.Index)(['expiresAt']),
    (0, typeorm_1.Index)(['createdAt'])
], Challenge);
//# sourceMappingURL=challenge.entity.js.map