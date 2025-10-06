import { Room } from './room.entity';
export declare class Transaction {
    id: string;
    roomId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    tokenType: string;
    txHash: string;
    createdAt: Date;
    room: Room;
}
