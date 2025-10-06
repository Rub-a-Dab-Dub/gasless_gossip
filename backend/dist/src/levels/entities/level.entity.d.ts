import { User } from '../../users/entities/user.entity';
export declare class Level {
    id: string;
    userId: string;
    user: User;
    level: number;
    currentXp: number;
    xpThreshold: number;
    totalXp: number;
    isLevelUpPending: boolean;
    createdAt: Date;
    updatedAt: Date;
}
