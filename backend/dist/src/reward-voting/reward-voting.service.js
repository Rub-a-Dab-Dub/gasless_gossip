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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardVotingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reward_vote_entity_1 = require("./reward-vote.entity");
const stellar_voting_service_1 = require("../dao-voting/stellar-voting.service");
let RewardVotingService = class RewardVotingService {
    voteRepo;
    stellarVoting;
    constructor(voteRepo, stellarVoting) {
        this.voteRepo = voteRepo;
        this.stellarVoting = stellarVoting;
    }
    async castVote(dto) {
        const { rewardId, userId, voteWeight, stellarAccountId } = dto;
        const existing = await this.voteRepo.findOne({ where: { rewardId, userId } });
        if (existing) {
            throw new common_1.ConflictException('User has already voted for this reward');
        }
        if (voteWeight <= 0) {
            throw new common_1.BadRequestException('voteWeight must be positive');
        }
        let stellarTxHash;
        if (stellarAccountId) {
            stellarTxHash = await this.stellarVoting.recordVoteOnStellar(stellarAccountId, rewardId, 'reward_vote', voteWeight);
        }
        const vote = this.voteRepo.create({
            rewardId,
            userId,
            voteWeight: String(voteWeight),
            stellarAccountId,
            stellarTxHash,
        });
        return await this.voteRepo.save(vote);
    }
    async getResults(rewardId) {
        const rows = await this.voteRepo.find({ where: { rewardId } });
        const votes = rows.map((r) => ({
            userId: r.userId,
            voteWeight: Number(r.voteWeight),
            stellarTxHash: r.stellarTxHash,
        }));
        const totalWeight = votes.reduce((sum, v) => sum + v.voteWeight, 0);
        return { rewardId, totalWeight, votes };
    }
};
exports.RewardVotingService = RewardVotingService;
exports.RewardVotingService = RewardVotingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reward_vote_entity_1.RewardVote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_voting_service_1.StellarVotingService])
], RewardVotingService);
//# sourceMappingURL=reward-voting.service.js.map