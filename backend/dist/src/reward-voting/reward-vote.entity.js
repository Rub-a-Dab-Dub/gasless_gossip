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
exports.RewardVote = void 0;
const typeorm_1 = require("typeorm");
let RewardVote = class RewardVote {
    id;
    rewardId;
    userId;
    voteWeight;
    stellarAccountId;
    stellarTxHash;
    createdAt;
    updatedAt;
};
exports.RewardVote = RewardVote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RewardVote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reward_id', type: 'uuid' }),
    (0, typeorm_1.Index)('idx_reward_votes_reward_id'),
    __metadata("design:type", String)
], RewardVote.prototype, "rewardId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    (0, typeorm_1.Index)('idx_reward_votes_user_id'),
    __metadata("design:type", String)
], RewardVote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vote_weight', type: 'numeric', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", String)
], RewardVote.prototype, "voteWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stellar_account_id', nullable: true }),
    __metadata("design:type", String)
], RewardVote.prototype, "stellarAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stellar_tx_hash', nullable: true }),
    __metadata("design:type", String)
], RewardVote.prototype, "stellarTxHash", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], RewardVote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], RewardVote.prototype, "updatedAt", void 0);
exports.RewardVote = RewardVote = __decorate([
    (0, typeorm_1.Entity)('reward_votes'),
    (0, typeorm_1.Unique)('uq_reward_user', ['rewardId', 'userId'])
], RewardVote);
//# sourceMappingURL=reward-vote.entity.js.map