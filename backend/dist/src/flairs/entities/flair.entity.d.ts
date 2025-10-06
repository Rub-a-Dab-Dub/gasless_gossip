import { User } from '../../users/entities/user.entity';
export declare class Flair {
    id: string;
    userId: string;
    flairType: string;
    metadata?: Record<string, any>;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
