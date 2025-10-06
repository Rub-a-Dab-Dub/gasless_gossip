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
var DaoVotingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoVotingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vote_entity_1 = require("./vote.entity");
const stellar_voting_service_1 = require("./stellar-voting.service");
let DaoVotingService = DaoVotingService_1 = class DaoVotingService {
    voteRepository;
    stellarVotingService;
    logger = new common_1.Logger(DaoVotingService_1.name);
    constructor(voteRepository, stellarVotingService) {
        this.voteRepository = voteRepository;
        this.stellarVotingService = stellarVotingService;
    }
    async castVote(createVoteDto) {
        const { proposalId, userId, choice, weight, stellarAccountId } = createVoteDto;
        const existingVote = await this.voteRepository.findOne({
            where: { proposalId, userId }
        });
        if (existingVote) {
            throw new common_1.ConflictException('User has already voted on this proposal');
        }
        const accountBalance = await this.stellarVotingService.getAccountBalance(stellarAccountId);
        if (weight > accountBalance) {
            throw new BadRequestException('Vote weight exceeds account balance');
        }
        const stellarTransactionHash = await this.stellarVotingService.recordVoteOnStellar(stellarAccountId, proposalId, choice, weight);
        const vote = this.voteRepository.create({
            proposalId,
            userId,
            choice,
            weight,
            stellarTransactionHash,
            stellarAccountId,
        });
        const savedVote = await this.voteRepository.save(vote);
        this.logger.log(`Vote recorded: ${savedVote.id} for proposal ${proposalId}`);
        return savedVote;
    }
    async getVotingResults(proposalId) {
        const votes = await this.voteRepository.find({
            where: { proposalId },
            order: { createdAt: 'DESC' }
        });
        if (votes.length === 0) {
            throw new common_1.NotFoundException('No votes found for this proposal');
        }
        const totalVotes = votes.length;
        const totalWeight = votes.reduce((sum, vote) => sum + Number(vote.weight), 0);
        const yesVotes = votes.filter(v => v.choice === 'yes').length;
        const noVotes = votes.filter(v => v.choice === 'no').length;
        const abstainVotes = votes.filter(v => v.choice === 'abstain').length;
        const yesWeight = votes
            .filter(v => v.choice === 'yes')
            .reduce((sum, vote) => sum + Number(vote.weight), 0);
        const noWeight = votes
            .filter(v => v.choice === 'no')
            .reduce((sum, vote) => sum + Number(vote.weight), 0);
        const abstainWeight = votes
            .filter(v => v.choice === 'abstain')
            .reduce((sum, vote) => sum + Number(vote.weight), 0);
        const participationRate = totalVotes > 0 ? (totalVotes / 1000) * 100 : 0;
        const weightedApprovalRate = totalWeight > 0 ? (yesWeight / totalWeight) * 100 : 0;
        const voteDetails = votes.map(vote => ({
            id: vote.id,
            userId: vote.userId,
            choice: vote.choice,
            weight: Number(vote.weight),
            stellarTransactionHash: vote.stellarTransactionHash,
            createdAt: vote.createdAt,
        }));
        return {
            proposalId,
            totalVotes,
            totalWeight,
            yesVotes,
            noVotes,
            abstainVotes,
            yesWeight,
            noWeight,
            abstainWeight,
            participationRate,
            weightedApprovalRate,
            votes: voteDetails,
        };
    }
    async validateVote(voteId) {
        const vote = await this.voteRepository.findOne({ where: { id: voteId } });
        if (!vote) {
            return false;
        }
        return await this.stellarVotingService.validateStellarTransaction(vote.stellarTransactionHash);
    }
    async getVotesByUser(userId) {
        return await this.voteRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.DaoVotingService = DaoVotingService;
exports.DaoVotingService = DaoVotingService = DaoVotingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_voting_service_1.StellarVotingService])
], DaoVotingService);
//# sourceMappingURL=dao-voting.service.js.map