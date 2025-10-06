"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardVotingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reward_vote_entity_1 = require("./reward-vote.entity");
const reward_voting_service_1 = require("./reward-voting.service");
const reward_voting_controller_1 = require("./reward-voting.controller");
const stellar_voting_service_1 = require("../dao-voting/stellar-voting.service");
let RewardVotingModule = class RewardVotingModule {
};
exports.RewardVotingModule = RewardVotingModule;
exports.RewardVotingModule = RewardVotingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reward_vote_entity_1.RewardVote])],
        controllers: [reward_voting_controller_1.RewardVotingController],
        providers: [reward_voting_service_1.RewardVotingService, stellar_voting_service_1.StellarVotingService],
        exports: [reward_voting_service_1.RewardVotingService],
    })
], RewardVotingModule);
//# sourceMappingURL=reward-voting.module.js.map