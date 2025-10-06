import { PumpRoomsService } from '../services/pump-rooms.service';
import { CreatePumpRoomDto } from '../dto/create-pump-room.dto';
import { VoteDto } from '../dto/vote.dto';
export declare class PumpRoomsController {
    private readonly pumpRoomsService;
    constructor(pumpRoomsService: PumpRoomsService);
    createRoom(createPumpRoomDto: CreatePumpRoomDto): Promise<{
        success: boolean;
        message: string;
        data: PumpRoom;
    }>;
    vote(voteDto: VoteDto): Promise<{
        success: boolean;
        message: string;
        data: import("../interfaces/stellar.interface").VoteResult;
    }>;
    getRoom(roomId: string): Promise<{
        success: boolean;
        data: PumpRoom;
    }>;
    getVotingData(roomId: string): Promise<{
        success: boolean;
        data: {
            roomId: any;
            totalVotes: any;
            isActive: any;
            endDate: any;
            predictions: any;
            createdAt: any;
        };
    }>;
    getActiveRooms(): Promise<{
        success: boolean;
        data: PumpRoom[];
    }>;
}
