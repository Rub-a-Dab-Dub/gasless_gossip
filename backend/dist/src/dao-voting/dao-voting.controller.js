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
exports.DaoVotingController = void 0;
const common_1 = require("@nestjs/common");
const dao_voting_service_1 = require("./dao-voting.service");
const dao_voting_dto_1 = require("./dao-voting.dto");
let DaoVotingController = class DaoVotingController {
    daoVotingService;
    constructor(daoVotingService) {
        this.daoVotingService = daoVotingService;
    }
    async castVote(createVoteDto) {
        return await this.daoVotingService.castVote(createVoteDto);
    }
    async getVotingResults(proposalId) {
        return await this.daoVotingService.getVotingResults(proposalId);
    }
    async getUserVotes(userId) {
        return await this.daoVotingService.getVotesByUser(userId);
    }
    async validateVote(voteId) {
        const isValid = await this.daoVotingService.validateVote(voteId);
        return { valid: isValid };
    }
};
exports.DaoVotingController = DaoVotingController;
__decorate([
    (0, common_1.Post)('vote'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dao_voting_dto_1.CreateVoteDto]),
    __metadata("design:returntype", Promise)
], DaoVotingController.prototype, "castVote", null);
__decorate([
    (0, common_1.Get)('results/:proposalId'),
    __param(0, (0, common_1.Param)('proposalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DaoVotingController.prototype, "getVotingResults", null);
__decorate([
    (0, common_1.Get)('votes/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DaoVotingController.prototype, "getUserVotes", null);
__decorate([
    (0, common_1.Get)('vote/:voteId/validate'),
    __param(0, (0, common_1.Param)('voteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DaoVotingController.prototype, "validateVote", null);
exports.DaoVotingController = DaoVotingController = __decorate([
    (0, common_1.Controller)('dao'),
    __metadata("design:paramtypes", [dao_voting_service_1.DaoVotingService])
], DaoVotingController);
//# sourceMappingURL=dao-voting.controller.js.map