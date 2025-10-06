import { User } from 'src/user/entities/user.entity';
export declare class AuditLog {
    id: string;
    action: string;
    changes: Record<string, any>;
    performedBy: string;
    user: User;
    userId: string;
    createdAt: Date;
}
