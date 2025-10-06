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
exports.ProposalValidationDto = exports.VoteDetailDto = exports.VotingResultDto = exports.CreateVoteDto = exports.VoteChoice = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var VoteChoice;
(function (VoteChoice) {
    VoteChoice["YES"] = "yes";
    VoteChoice["NO"] = "no";
    VoteChoice["ABSTAIN"] = "abstain";
})(VoteChoice || (exports.VoteChoice = VoteChoice = {}));
class CreateVoteDto {
    proposalId;
    userId;
    choice;
    weight;
    stellarAccountId;
    stellarTransactionHash;
}
exports.CreateVoteDto = CreateVoteDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVoteDto.prototype, "proposalId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVoteDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VoteChoice),
    __metadata("design:type", String)
], CreateVoteDto.prototype, "choice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.00000001),
    (0, class_validator_1.Max)(999999999),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateVoteDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoteDto.prototype, "stellarAccountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoteDto.prototype, "stellarTransactionHash", void 0);
class VotingResultDto {
    proposalId;
    totalVotes;
    totalWeight;
    yesVotes;
    noVotes;
    abstainVotes;
    yesWeight;
    noWeight;
    abstainWeight;
    participationRate;
    weightedApprovalRate;
    votes;
}
exports.VotingResultDto = VotingResultDto;
class VoteDetailDto {
    id;
    userId;
    choice;
    weight;
    stellarTransactionHash;
    createdAt;
}
exports.VoteDetailDto = VoteDetailDto;
class ProposalValidationDto {
    proposalId;
    title;
    description;
    minimumVotingWeight;
    votingPeriodHours;
}
exports.ProposalValidationDto = ProposalValidationDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ProposalValidationDto.prototype, "proposalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProposalValidationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProposalValidationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProposalValidationDto.prototype, "minimumVotingWeight", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProposalValidationDto.prototype, "votingPeriodHours", void 0);
//# sourceMappingURL=dao-voting.dto.js.map