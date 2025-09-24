
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PumpRoom } from '../entities/pump-room.entity';
import { CreatePumpRoomDto } from '../dto/create-pump-room.dto';
import { VoteDto } from '../dto/vote.dto';
import { StellarService } from './stellar.service';
import { VoteResult } from '../interfaces/stellar.interface';

@Injectable()
export class PumpRoomsService {
  private readonly logger = new Logger(PumpRoomsService.name);

  constructor(
    @InjectRepository(PumpRoom)
    private pumpRoomRepository: Repository<PumpRoom>,
    private stellarService: StellarService,
  ) {}

  async createRoom(createPumpRoomDto: CreatePumpRoomDto): Promise<PumpRoom> {
    try {
      // Check if room already exists
      const existingRoom = await this.pumpRoomRepository.findOne({
        where: { roomId: createPumpRoomDto.roomId }
      });

      if (existingRoom) {
        throw new BadRequestException(`Room with ID ${createPumpRoomDto.roomId} already exists`);
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
    } catch (error) {
      this.logger.error(`Failed to create room: ${error.message}`);
      throw error;
    }
  }

  async vote(voteDto: VoteDto): Promise<VoteResult> {
    try {
      const room = await this.pumpRoomRepository.findOne({
        where: { roomId: voteDto.roomId, isActive: true }
      });

      if (!room) {
        throw new NotFoundException(`Active room with ID ${voteDto.roomId} not found`);
      }

      // Check if room has ended
      if (room.endDate && new Date() > room.endDate) {
        throw new BadRequestException('Voting period has ended for this room');
      }

      // Check if prediction exists
      const predictionExists = room.predictions.some(p => p.id === voteDto.predictionId);
      if (!predictionExists) {
        throw new BadRequestException(`Prediction ${voteDto.predictionId} not found in room`);
      }

      // Check if user already voted
      const userVoteKey = `${voteDto.userId}_${voteDto.predictionId}`;
      if (room.votes[userVoteKey]) {
        throw new BadRequestException('User has already voted on this prediction');
      }

      // Calculate reward amount
      const rewardAmount = this.stellarService.calculateRewardAmount(
        voteDto.confidence,
        room.totalVotes
      );

      // Execute Stellar reward contract if address provided
      let stellarReward;
      if (voteDto.stellarAddress) {
        stellarReward = await this.stellarService.executeRewardContract(
          voteDto.stellarAddress,
          rewardAmount,
          voteDto.roomId,
          voteDto.predictionId
        );
      }

      // Update room with new vote
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

      const result: VoteResult = {
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
    } catch (error) {
      this.logger.error(`Failed to process vote: ${error.message}`);
      throw error;
    }
  }

  async getRoomById(roomId: string): Promise<PumpRoom> {
    const room = await this.pumpRoomRepository.findOne({
      where: { roomId }
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    return room;
  }

  async getAllActiveRooms(): Promise<PumpRoom[]> {
    return this.pumpRoomRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async getVotingData(roomId: string) {
    const room = await this.getRoomById(roomId);
    
    // Aggregate voting data
    const votingSummary = room.predictions.map(prediction => {
      const predictionVotes = Object.values(room.votes).filter(
        (vote: any) => vote.predictionId === prediction.id
      );
      
      const totalConfidence = predictionVotes.reduce(
        (sum: number, vote: any) => sum + vote.confidence, 0
      );
      
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
}