import { Room } from './room.entity';
export declare class Message {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    autoDelete: boolean;
    reactionCount: number;
    createdAt: Date;
    room: Room;
}
