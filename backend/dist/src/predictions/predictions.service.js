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
var PredictionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prediction_entity_1 = require("./entities/prediction.entity");
const prediction_vote_entity_1 = require("./entities/prediction-vote.entity");
const stellar_service_1 = require("../stellar/stellar.service");
let PredictionsService = PredictionsService_1 = class PredictionsService {
    predictionRepository;
    predictionVoteRepository;
    dataSource;
    stellarService;
    logger = new common_1.Logger(PredictionsService_1.name);
    constructor(predictionRepository, predictionVoteRepository, dataSource, stellarService) {
        this.predictionRepository = predictionRepository;
        this.predictionVoteRepository = predictionVoteRepository;
        this.dataSource = dataSource;
        this.stellarService = stellarService;
    }
    async createPrediction(userId, createPredictionDto) {
        const { roomId, title, description, prediction, expiresAt } = createPredictionDto;
        const expirationDate = new Date(expiresAt);
        if (expirationDate <= new Date()) {
            throw new common_1.BadRequestException('Expiration date must be in the future');
        }
        const newPrediction = this.predictionRepository.create({
            roomId,
            userId,
            title,
            description,
            prediction,
            expiresAt: expirationDate,
            status: prediction_entity_1.PredictionStatus.ACTIVE,
            outcome: prediction_entity_1.PredictionOutcome.PENDING,
        });
        const savedPrediction = await this.predictionRepository.save(newPrediction);
        this.logger.log(`Created prediction ${savedPrediction.id} by user ${userId} in room ${roomId}`);
        return savedPrediction;
    }
    async voteOnPrediction(userId, votePredictionDto) {
        const { predictionId, isCorrect } = votePredictionDto;
        const prediction = await this.predictionRepository.findOne({
            where: { id: predictionId },
            relations: ['room'],
        });
        if (!prediction) {
            throw new common_1.NotFoundException('Prediction not found');
        }
        if (prediction.status !== prediction_entity_1.PredictionStatus.ACTIVE) {
            throw new common_1.BadRequestException('Cannot vote on inactive prediction');
        }
        if (prediction.expiresAt <= new Date()) {
            throw new common_1.BadRequestException('Prediction has expired');
        }
        const existingVote = await this.predictionVoteRepository.findOne({
            where: { predictionId, userId },
        });
        if (existingVote) {
            throw new common_1.BadRequestException('User has already voted on this prediction');
        }
        const vote = this.predictionVoteRepository.create({
            predictionId,
            userId,
            isCorrect,
        });
        const savedVote = await this.predictionVoteRepository.save(vote);
        await this.updatePredictionVoteCounts(predictionId);
        this.logger.log(`User ${userId} voted ${isCorrect ? 'correct' : 'incorrect'} on prediction ${predictionId}`);
        return savedVote;
    }
    async resolvePrediction(userId, resolvePredictionDto) {
        const { predictionId, isCorrect } = resolvePredictionDto;
        const prediction = await this.predictionRepository.findOne({
            where: { id: predictionId },
            relations: ['votes'],
        });
        if (!prediction) {
            throw new common_1.NotFoundException('Prediction not found');
        }
        if (prediction.userId !== userId) {
            throw new common_1.ForbiddenException('Only the prediction creator can resolve it');
        }
        if (prediction.isResolved) {
            throw new common_1.BadRequestException('Prediction is already resolved');
        }
        prediction.status = prediction_entity_1.PredictionStatus.RESOLVED;
        prediction.outcome = isCorrect ? prediction_entity_1.PredictionOutcome.CORRECT : prediction_entity_1.PredictionOutcome.INCORRECT;
        prediction.isResolved = true;
        prediction.resolvedAt = new Date();
        await this.calculateAndDistributeRewards(prediction);
        const resolvedPrediction = await this.predictionRepository.save(prediction);
        this.logger.log(`Prediction ${predictionId} resolved as ${isCorrect ? 'correct' : 'incorrect'}`);
        return resolvedPrediction;
    }
    async getPredictionsByRoom(roomId, status) {
        const query = this.predictionRepository
            .createQueryBuilder('prediction')
            .leftJoinAndSelect('prediction.user', 'user')
            .leftJoinAndSelect('prediction.votes', 'votes')
            .leftJoinAndSelect('votes.user', 'voteUser')
            .where('prediction.roomId = :roomId', { roomId })
            .orderBy('prediction.createdAt', 'DESC');
        if (status) {
            query.andWhere('prediction.status = :status', { status });
        }
        return query.getMany();
    }
    async getPredictionById(id) {
        const prediction = await this.predictionRepository.findOne({
            where: { id },
            relations: ['user', 'room', 'votes', 'votes.user'],
        });
        if (!prediction) {
            throw new common_1.NotFoundException('Prediction not found');
        }
        return prediction;
    }
    async getUserPredictions(userId) {
        return this.predictionRepository.find({
            where: { userId },
            relations: ['room', 'votes'],
            order: { createdAt: 'DESC' },
        });
    }
    async updatePredictionVoteCounts(predictionId) {
        const voteCounts = await this.predictionVoteRepository
            .createQueryBuilder('vote')
            .select([
            'COUNT(*) as totalVotes',
            'SUM(CASE WHEN vote.isCorrect = true THEN 1 ELSE 0 END) as correctVotes',
            'SUM(CASE WHEN vote.isCorrect = false THEN 1 ELSE 0 END) as incorrectVotes',
        ])
            .where('vote.predictionId = :predictionId', { predictionId })
            .getRawOne();
        await this.predictionRepository.update(predictionId, {
            voteCount: parseInt(voteCounts.totalVotes) || 0,
            correctVotes: parseInt(voteCounts.correctVotes) || 0,
            incorrectVotes: parseInt(voteCounts.incorrectVotes) || 0,
        });
    }
    async calculateAndDistributeRewards(prediction) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const correctVotes = await this.predictionVoteRepository.find({
                where: { predictionId: prediction.id, isCorrect: true },
                relations: ['user'],
            });
            if (correctVotes.length === 0) {
                this.logger.log(`No correct votes for prediction ${prediction.id}, no rewards to distribute`);
                await queryRunner.commitTransaction();
                return;
            }
            const baseRewardPerVote = 10;
            const totalRewardPool = correctVotes.length * baseRewardPerVote;
            await queryRunner.manager.update(prediction_entity_1.Prediction, prediction.id, {
                rewardPool: totalRewardPool,
                rewardPerCorrectVote: baseRewardPerVote,
            });
            for (const vote of correctVotes) {
                try {
                    await queryRunner.manager.update(prediction_vote_entity_1.PredictionVote, vote.id, {
                        rewardAmount: baseRewardPerVote,
                    });
                    await this.stellarService.distributeReward(vote.userId, baseRewardPerVote);
                    this.logger.log(`Distributed ${baseRewardPerVote} tokens to user ${vote.userId} for correct prediction vote`);
                }
                catch (error) {
                    this.logger.error(`Failed to distribute reward to user ${vote.userId}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Successfully distributed rewards for prediction ${prediction.id}`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to distribute rewards for prediction ${prediction.id}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PredictionsService = PredictionsService;
exports.PredictionsService = PredictionsService = PredictionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prediction_entity_1.Prediction)),
    __param(1, (0, typeorm_1.InjectRepository)(prediction_vote_entity_1.PredictionVote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        stellar_service_1.StellarService])
], PredictionsService);
//# sourceMappingURL=predictions.service.js.map