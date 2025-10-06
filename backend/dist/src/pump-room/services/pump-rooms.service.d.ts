import { Repository } from 'typeorm';
import { PumpRoom } from '../entities/pump-room.entity';
import { CreatePumpRoomDto } from '../dto/create-pump-room.dto';
import { VoteDto } from '../dto/vote.dto';
import { StellarService } from './stellar.service';
import { VoteResult } from '../interfaces/stellar.interface';
export declare class PumpRoomsService {
    private pumpRoomRepository;
    private stellarService;
    private readonly logger;
    constructor(pumpRoomRepository: Repository<PumpRoom>, stellarService: StellarService);
    createRoom(createPumpRoomDto: CreatePumpRoomDto): Promise<PumpRoom>;
    vote(voteDto: VoteDto): Promise<VoteResult>;
    getRoomById(roomId: string): Promise<PumpRoom>;
    getAllActiveRooms(): Promise<PumpRoom[]>;
    getVotingData(roomId: string): Promise<{
        roomId: any;
        totalVotes: any;
        isActive: any;
        endDate: any;
        predictions: any;
        createdAt: any;
    }>;
}
