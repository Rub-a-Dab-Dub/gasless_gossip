import type { Repository } from "typeorm";
import { type RoomParticipant } from "../entities/room-participant.entity";
export declare class RoomAccessService {
    private participantRepository;
    constructor(participantRepository: Repository<RoomParticipant>);
    verifyRoomAccess(roomId: string, userId: string): Promise<RoomParticipant>;
    verifyInvitePermission(roomId: string, userId: string): Promise<RoomParticipant>;
    verifyRoomAdmin(roomId: string, userId: string): Promise<RoomParticipant>;
    getRoomParticipants(roomId: string, userId: string): Promise<RoomParticipant[]>;
    isRoomOwner(roomId: string, userId: string): Promise<boolean>;
    getRoomStats(roomId: string, userId: string): Promise<{
        totalParticipants: number;
        activeParticipants: number;
        adminCount: number;
        memberCount: number;
    }>;
}
