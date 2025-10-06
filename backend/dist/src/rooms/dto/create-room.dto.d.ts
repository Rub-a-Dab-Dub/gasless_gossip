import { RoomType } from '../entities/room.entity';
export declare class CreateRoomDto {
    name: string;
    description?: string;
    type: RoomType;
    maxMembers?: number;
    minLevel?: number;
    minXp?: number;
}
