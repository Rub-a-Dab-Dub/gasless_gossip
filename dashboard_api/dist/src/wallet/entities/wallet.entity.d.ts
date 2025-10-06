import { User } from 'src/user/entities/user.entity';
export declare class Wallet {
    id: string;
    address: string;
    balance: string;
    lastSyncedAt: Date;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
