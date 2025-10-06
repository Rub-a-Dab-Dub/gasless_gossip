import { User } from '../../users/entities/user.entity';
export declare class Reputation {
    id: number;
    userId: number;
    user: User;
    score: number;
    updatedAt: Date;
}
