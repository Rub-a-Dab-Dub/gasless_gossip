import { Badge } from '../../badges/entities/badge.entity';
import { Reputation } from '../../reputation/entities/reputation.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    pseudonym: string;
    stellarAccountId: string;
    badges: Badge[];
    reputations: Reputation[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
