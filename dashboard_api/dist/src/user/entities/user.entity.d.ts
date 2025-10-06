import { AuditLog } from 'src/audit-log/entities/audit-log.entity';
import { Pseudonym } from 'src/pseudonym/entities/pseudonym.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    bio: string;
    avatarUrl: string;
    level: number;
    xp: number;
    isVerified: boolean;
    isSuspended: boolean;
    suspensionReason: string;
    isDeleted: boolean;
    deletedAt: Date;
    lastActivityAt: Date;
    badges: string[];
    messagesSent: number;
    roomsJoined: number;
    tokensTransacted: number;
    pseudonyms: Pseudonym[];
    wallet: Wallet;
    auditLogs: AuditLog[];
    createdAt: Date;
    updatedAt: Date;
}
