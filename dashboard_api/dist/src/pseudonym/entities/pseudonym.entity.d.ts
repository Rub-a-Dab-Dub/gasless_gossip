import { User } from 'src/user/entities/user.entity';
export declare class Pseudonym {
    id: string;
    name: string;
    isActive: boolean;
    user: User;
    createdAt: Date;
}
