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
exports.Achievement = exports.AchievementTier = exports.AchievementType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var AchievementType;
(function (AchievementType) {
    AchievementType["MESSAGES_SENT"] = "messages_sent";
    AchievementType["ROOMS_JOINED"] = "rooms_joined";
    AchievementType["PREDICTIONS_MADE"] = "predictions_made";
    AchievementType["BETS_PLACED"] = "bets_placed";
    AchievementType["GAMBLES_PLAYED"] = "gambles_played";
    AchievementType["TRADES_COMPLETED"] = "trades_completed";
    AchievementType["VISITS_MADE"] = "visits_made";
    AchievementType["LEVEL_REACHED"] = "level_reached";
    AchievementType["STREAK_DAYS"] = "streak_days";
    AchievementType["TOKENS_EARNED"] = "tokens_earned";
})(AchievementType || (exports.AchievementType = AchievementType = {}));
var AchievementTier;
(function (AchievementTier) {
    AchievementTier["BRONZE"] = "bronze";
    AchievementTier["SILVER"] = "silver";
    AchievementTier["GOLD"] = "gold";
    AchievementTier["PLATINUM"] = "platinum";
    AchievementTier["DIAMOND"] = "diamond";
})(AchievementTier || (exports.AchievementTier = AchievementTier = {}));
let Achievement = class Achievement {
    id;
    userId;
    type;
    tier;
    milestoneValue;
    rewardAmount;
    stellarTransactionHash;
    isClaimed;
    awardedAt;
    user;
};
exports.Achievement = Achievement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Achievement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Achievement.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AchievementType,
    }),
    __metadata("design:type", String)
], Achievement.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AchievementTier,
        default: AchievementTier.BRONZE,
    }),
    __metadata("design:type", String)
], Achievement.prototype, "tier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'milestone_value', type: 'integer' }),
    __metadata("design:type", Number)
], Achievement.prototype, "milestoneValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reward_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Achievement.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stellar_transaction_hash', nullable: true }),
    __metadata("design:type", String)
], Achievement.prototype, "stellarTransactionHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_claimed', default: false }),
    __metadata("design:type", Boolean)
], Achievement.prototype, "isClaimed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'awarded_at' }),
    __metadata("design:type", Date)
], Achievement.prototype, "awardedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Achievement.prototype, "user", void 0);
exports.Achievement = Achievement = __decorate([
    (0, typeorm_1.Entity)('achievements')
], Achievement);
//# sourceMappingURL=achievement.entity.js.map