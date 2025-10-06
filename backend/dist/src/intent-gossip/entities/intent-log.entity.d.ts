import { User } from '../../users/entities/user.entity';
export declare class IntentLog {
    id: string;
    type: string;
    payload: any;
    chains: string[];
    user: User;
    createdAt: Date;
}
