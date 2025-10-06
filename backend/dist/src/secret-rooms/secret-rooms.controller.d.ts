import { SecretRoomsService } from './services/secret-rooms.service';
import { CreateSecretRoomDto, UpdateSecretRoomDto, JoinRoomDto, InviteUserDto, SecretRoomDto, RoomMemberDto, RoomInvitationDto, RoomStatsDto, UserRoomLimitDto } from './dto/secret-room.dto';
export declare class SecretRoomsController {
    private readonly secretRoomsService;
    constructor(secretRoomsService: SecretRoomsService);
    createSecretRoom(dto: CreateSecretRoomDto, req: any): Promise<SecretRoomDto>;
    getSecretRoom(id: string, req: any): Promise<SecretRoomDto>;
    getSecretRoomByCode(roomCode: string, req: any): Promise<SecretRoomDto>;
    getUserRooms(limit?: number, req: any): Promise<SecretRoomDto[]>;
    joinRoom(dto: JoinRoomDto, req: any): Promise<RoomMemberDto>;
    leaveRoom(id: string, req: any): Promise<{
        message: string;
    }>;
    inviteUser(id: string, dto: InviteUserDto, req: any): Promise<RoomInvitationDto>;
    acceptInvitation(body: {
        invitationCode: string;
    }, req: any): Promise<RoomMemberDto>;
    getRoomMembers(id: string, req: any): Promise<RoomMemberDto[]>;
    updateRoom(id: string, dto: UpdateSecretRoomDto, req: any): Promise<SecretRoomDto>;
    deleteRoom(id: string, req: any): Promise<{
        message: string;
    }>;
    getRoomStats(): Promise<RoomStatsDto>;
    getUserRoomLimit(req: any): Promise<UserRoomLimitDto>;
    testConcurrentRoomCreation(rooms: number | undefined, req: any): Promise<{
        message: string;
        totalRooms: number;
        totalTime: string;
        averageTime: string;
        roomsPerSecond: string;
        results: SecretRoomDto[];
    }>;
    testPerformance(operations: number | undefined, req: any): Promise<{
        message: string;
        operations: number;
        totalTime: string;
        averageTime: string;
        operationsPerSecond: string;
        performance: {
            roomCreation: string;
            roomRetrieval: string;
            memberJoin: string;
            roomUpdate: string;
        };
    }>;
}
