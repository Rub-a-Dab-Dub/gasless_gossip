import { User } from '../../users/entities/user.entity';
export declare class Badge {
    id: number;
    userId: number;
    user: User;
    type: string;
    metadata: Record<string, any>;
}
