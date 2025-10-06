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
var ChallengesService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesService = exports.ChallengeStatus = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const challenge_entity_1 = require("../entities/challenge.entity");
const challenge_participation_entity_1 = require("../entities/challenge-participation.entity");
const config_1 = require("@nestjs/config");
const stellar_service_1 = require("@/stellar/stellar.service");
const users_service_1 = require("@/users/users.service");
var ChallengeStatus;
(function (ChallengeStatus) {
    ChallengeStatus["ACTIVE"] = "ACTIVE";
    ChallengeStatus["COMPLETED"] = "COMPLETED";
    ChallengeStatus["EXPIRED"] = "EXPIRED";
})(ChallengeStatus || (exports.ChallengeStatus = ChallengeStatus = {}));
let ChallengesService = ChallengesService_1 = class ChallengesService {
    challengeRepository;
    participationRepository;
    configService;
    stellarService;
    usersService;
    logger = new common_1.Logger(ChallengesService_1.name);
    constructor(challengeRepository, participationRepository, configService, stellarService, usersService) {
        this.challengeRepository = challengeRepository;
        this.participationRepository = participationRepository;
        this.configService = configService;
        this.stellarService = stellarService;
        this.usersService = usersService;
    }
    async createChallenge(dto) {
        const challenge = this.challengeRepository.create({
            title: dto.title,
            goal: dto.goal,
            expiry: dto.expiry,
            reward: dto.reward,
        });
        return this.challengeRepository.save(challenge);
    }
    async getChallenges() {
        return this.challengeRepository.find({
            where: { expiry: () => 'expiry > NOW()' },
        });
    }
    async joinChallenge(userId, dto) {
        const challenge = await this.challengeRepository.findOne({
            where: { id: dto.challengeId },
        });
        if (!challenge) {
            throw new common_1.NotFoundException(`Challenge ${dto.challengeId} not found`);
        }
        const existing = await this.participationRepository.findOne({
            where: { userId, challenge: { id: dto.challengeId } },
            relations: ['challenge'],
        });
        if (existing) {
            throw new common_1.BadRequestException('User already joined this challenge');
        }
        const participation = this.participationRepository.create({
            userId,
            challenge,
            progress: 0,
            status: ChallengeStatus.ACTIVE,
        });
        return this.participationRepository.save(participation);
    }
    async updateProgress(userId, challengeId, increment) {
        const participation = await this.participationRepository.findOne({
            where: { userId, challenge: { id: challengeId } },
            relations: ['challenge'],
        });
        if (!participation) {
            throw new common_1.NotFoundException('Participation not found');
        }
        if (participation.status !== ChallengeStatus.ACTIVE) {
            throw new common_1.BadRequestException('Challenge is not active');
        }
        participation.progress += increment;
        if (participation.progress >= participation.challenge.goal) {
            participation.status = ChallengeStatus.COMPLETED;
            participation.completedAt = new Date();
            const rewardResult = await this.processReward(participation);
            if (!rewardResult.success) {
                this.logger.error(`Reward distribution failed: ${rewardResult.error}`);
            }
        }
        return this.participationRepository.save(participation);
    }
    async processReward(participation) {
        try {
            if (participation.stellarTransactionId) {
                this.logger.log(`Reward already distributed for participation ${participation.id}: ${participation.stellarTransactionId}`);
                return { success: true, transactionId: participation.stellarTransactionId };
            }
            const user = await this.usersService.findById(participation.userId);
            const userStellarPublicKey = user?.stellarPublicKey || user?.walletInfo?.stellarPublicKey;
            if (!userStellarPublicKey) {
                throw new Error(`User ${participation.userId} has no Stellar public key`);
            }
            const rewardAmount = participation.challenge.reward || 0;
            const result = await this.stellarService.distributeReward(userStellarPublicKey, rewardAmount);
            if (!result.success) {
                participation.rewardFailedReason = result.error || 'Unknown error';
                await this.participationRepository.save(participation);
                return { success: false, error: participation.rewardFailedReason };
            }
            participation.stellarTransactionId = result.txHash;
            await this.participationRepository.save(participation);
            this.logger.log(`Reward distributed for participation ${participation.id}: tx ${result.txHash}`);
            return { success: true, transactionId: result.txHash };
        }
        catch (error) {
            this.logger.error(`processReward error: ${error.message}`);
            return { success: false, error: error.message || String(error) };
        }
    }
};
exports.ChallengesService = ChallengesService;
exports.ChallengesService = ChallengesService = ChallengesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(challenge_entity_1.Challenge)),
    __param(1, (0, typeorm_1.InjectRepository)(challenge_participation_entity_1.ChallengeParticipation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService, typeof (_a = typeof stellar_service_1.StellarService !== "undefined" && stellar_service_1.StellarService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], ChallengesService);
//# sourceMappingURL=challenges.service.js.map