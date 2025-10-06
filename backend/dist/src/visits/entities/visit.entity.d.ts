import { User } from "../../users/entities/user.entity";
export declare class Visit {
    id: string;
    roomId: string;
    userId: string;
    createdAt: Date;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    duration: number;
    user: User;
}
