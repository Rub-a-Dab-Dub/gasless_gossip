import { Room } from '../../rooms/entities/room.entity';
export declare class RoomTag {
    id: string;
    roomId: string;
    tagName: string;
    createdBy: string;
    room: Room;
    createdAt: Date;
}
