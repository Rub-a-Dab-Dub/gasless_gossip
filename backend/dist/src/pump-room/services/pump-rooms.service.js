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
var PumpRoomsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpRoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pump_room_entity_1 = require("../entities/pump-room.entity");
const stellar_service_1 = require("./stellar.service");
let PumpRoomsService = PumpRoomsService_1 = class PumpRoomsService {
    pumpRoomRepository;
    stellarService;
    logger = new common_1.Logger(PumpRoomsService_1.name);
    constructor(pumpRoomRepository, stellarService) {
        this.pumpRoomRepository = pumpRoomRepository;
        this.stellarService = stellarService;
    }
    async createRoom(createPumpRoomDto) {
        try {
            const existingRoom = await this.pumpRoomRepository.findOne({
                where: { roomId: createPumpRoomDto.roomId }
            });
            if (existingRoom) {
                throw new common_1.BadRequestException(`Room with ID ${createPumpRoomDto.roomId} already exists`);
            }
            const pumpRoom = this.pumpRoomRepository.create({
                roomId: createPumpRoomDto.roomId,
                predictions: createPumpRoomDto.predictions,
                votes: {},
                totalVotes: 0,
                endDate: createPumpRoomDto.endDate ? new Date(createPumpRoomDto.endDate) : null
            });
            const savedRoom = await this.pumpRoomRepository.save(pumpRoom);
            this.logger.log(`Created pump room: ${savedRoom.roomId}`);
            return savedRoom;
        }
        catch (error) {
            this.logger.error(`Failed to create room: ${error.message}`);
            throw error;
        }
    }
    async vote(voteDto) {
        try {
            const room = await this.pumpRoomRepository.findOne({
                where: { roomId: voteDto.roomId, isActive: true }
            });
            if (!room) {
                throw new common_1.NotFoundException(`Active room with ID ${voteDto.roomId} not found`);
            }
            if (room.endDate && new Date() > room.endDate) {
                throw new common_1.BadRequestException('Voting period has ended for this room');
            }
            const predictionExists = room.predictions.some(p => p.id === voteDto.predictionId);
            if (!predictionExists) {
                throw new common_1.BadRequestException(`Prediction ${voteDto.predictionId} not found in room`);
            }
            const userVoteKey = `${voteDto.userId}_${voteDto.predictionId}`;
            if (room.votes[userVoteKey]) {
                throw new common_1.BadRequestException('User has already voted on this prediction');
            }
            const rewardAmount = this.stellarService.calculateRewardAmount(voteDto.confidence, room.totalVotes);
            let stellarReward;
            if (voteDto.stellarAddress) {
                stellarReward = await this.stellarService.executeRewardContract(voteDto.stellarAddress, rewardAmount, voteDto.roomId, voteDto.predictionId);
            }
            const voteId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const voteData = {
                voteId,
                userId: voteDto.userId,
                predictionId: voteDto.predictionId,
                confidence: voteDto.confidence,
                timestamp: new Date().toISOString(),
                rewardAmount,
                stellarTx: stellarReward?.transactionHash
            };
            room.votes[userVoteKey] = voteData;
            room.totalVotes += 1;
            await this.pumpRoomRepository.save(room);
            const result = {
                voteId,
                roomId: voteDto.roomId,
                predictionId: voteDto.predictionId,
                userId: voteDto.userId,
                confidence: voteDto.confidence,
                stellarReward,
                timestamp: new Date()
            };
            this.logger.log(`Vote recorded: ${JSON.stringify(result)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to process vote: ${error.message}`);
            throw error;
        }
    }
    async getRoomById(roomId) {
        const room = await this.pumpRoomRepository.findOne({
            where: { roomId }
        });
        if (!room) {
            throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
        }
        return room;
    }
    async getAllActiveRooms() {
        return this.pumpRoomRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' }
        });
    }
    async getVotingData(roomId) {
        const room = await this.getRoomById(roomId);
        const votingSummary = room.predictions.map(prediction => {
            const predictionVotes = Object.values(room.votes).filter((vote) => vote.predictionId === prediction.id);
            const totalConfidence = predictionVotes.reduce((sum, vote) => sum + vote.confidence, 0);
            return {
                predictionId: prediction.id,
                title: prediction.title,
                voteCount: predictionVotes.length,
                averageConfidence: predictionVotes.length > 0 ? totalConfidence / predictionVotes.length : 0,
                votes: predictionVotes
            };
        });
        return {
            roomId: room.roomId,
            totalVotes: room.totalVotes,
            isActive: room.isActive,
            endDate: room.endDate,
            predictions: votingSummary,
            createdAt: room.createdAt
        };
    }
};
exports.PumpRoomsService = PumpRoomsService;
exports.PumpRoomsService = PumpRoomsService = PumpRoomsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pump_room_entity_1.PumpRoom)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stellar_service_1.StellarService])
], PumpRoomsService);
//# sourceMappingURL=pump-rooms.service.js.map