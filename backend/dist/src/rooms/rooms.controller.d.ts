import { RoomsService } from './rooms.service';
import { JoinRoomDto, LeaveRoomDto } from './dto/room-membership.dto';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    createRoom(req: any, createRoomDto: CreateRoomDto): Promise<import("./entities/room.entity").Room>;
    joinRoom(req: any, joinRoomDto: JoinRoomDto): Promise<{
        success: boolean;
        message: string;
        xpAwarded?: number;
    }>;
    leaveRoom(req: any, leaveRoomDto: LeaveRoomDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllRooms(req: any): Promise<import("./entities/room.entity").Room[]>;
    getRoomMembers(roomId: string): Promise<import("./entities/room-membership.entity").RoomMembership[]>;
    getUserRooms(req: any): Promise<import("./entities/room.entity").Room[]>;
}
