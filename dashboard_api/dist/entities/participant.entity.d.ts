import { Room } from './room.entity';
export declare class Participant {
    id: string;
    userId: string;
    pseudonym: string;
    roomId: string;
    messageCount: number;
    reactionCount: number;
    joinedAt: Date;
    room: Room;
}
