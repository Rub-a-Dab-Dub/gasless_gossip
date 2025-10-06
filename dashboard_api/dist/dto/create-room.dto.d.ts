import { RoomType } from '../entities/room.entity';
export declare class CreateRoomDto {
    name: string;
    type: RoomType;
    expiresAt?: string;
    maxParticipants?: number;
    theme?: string;
    moderatorIds?: string[];
    accessRules?: Record<string, any>;
}
