import { User } from '../../users/entities/user.entity';
export declare class Tip {
    id: string;
    amount: number;
    receiverId: string;
    senderId: string;
    txId: string;
    createdAt: Date;
    receiver?: User;
    sender?: User;
}
