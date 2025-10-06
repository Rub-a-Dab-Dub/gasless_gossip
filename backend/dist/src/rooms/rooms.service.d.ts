import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomMembership } from './entities/room-membership.entity';
import { User } from '../users/entities/user.entity';
import { XpService } from '../xp/xp.service';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private readonly roomRepository;
    private readonly membershipRepository;
    private readonly userRepository;
    private readonly xpService;
    constructor(roomRepository: Repository<Room>, membershipRepository: Repository<RoomMembership>, userRepository: Repository<User>, xpService: XpService);
    createRoom(createRoomDto: CreateRoomDto, createdBy: string): Promise<Room>;
    joinRoom(userId: string, roomId: string, chatGateway?: any): Promise<{
        success: boolean;
        message: string;
        xpAwarded?: number;
    }>;
    leaveRoom(userId: string, roomId: string, chatGateway?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getRoomMembers(roomId: string): Promise<RoomMembership[]>;
    getUserRooms(userId: string): Promise<Room[]>;
    getAllRooms(userId?: string): Promise<Room[]>;
    private addMembership;
    private validateRoomAccess;
    private awardJoinRoomXP;
}
