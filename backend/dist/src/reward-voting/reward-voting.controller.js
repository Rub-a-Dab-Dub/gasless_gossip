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
exports.RewardVotingController = void 0;
const common_1 = require("@nestjs/common");
const reward_voting_service_1 = require("./reward-voting.service");
const reward_voting_dto_1 = require("./reward-voting.dto");
let RewardVotingController = class RewardVotingController {
    service;
    constructor(service) {
        this.service = service;
    }
    async vote(body) {
        const v = await this.service.castVote(body);
        return {
            id: v.id,
            rewardId: v.rewardId,
            userId: v.userId,
            voteWeight: Number(v.voteWeight),
            stellarTxHash: v.stellarTxHash,
        };
    }
    async results(query) {
        return await this.service.getResults(query.rewardId);
    }
};
exports.RewardVotingController = RewardVotingController;
__decorate([
    (0, common_1.Post)('vote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reward_voting_dto_1.CastRewardVoteDto]),
    __metadata("design:returntype", Promise)
], RewardVotingController.prototype, "vote", null);
__decorate([
    (0, common_1.Get)('results'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reward_voting_dto_1.RewardsResultsQueryDto]),
    __metadata("design:returntype", Promise)
], RewardVotingController.prototype, "results", null);
exports.RewardVotingController = RewardVotingController = __decorate([
    (0, common_1.Controller)('rewards'),
    __metadata("design:paramtypes", [reward_voting_service_1.RewardVotingService])
], RewardVotingController);
//# sourceMappingURL=reward-voting.controller.js.map