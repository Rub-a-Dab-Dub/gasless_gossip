import { User } from "../../users/entities/user.entity";
export declare enum InvitationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    EXPIRED = "expired",
    REVOKED = "revoked"
}
export declare class Invitation {
    id: string;
    roomId: string;
    inviterId: string;
    inviteeId?: string;
    code: string;
    message?: string;
    status: InvitationStatus;
    expiresAt: Date;
    acceptedAt?: Date;
    stellarTxId?: string;
    usageCount: number;
    maxUsage: number;
    metadata?: Record<string, any>;
    inviter: User;
    invitee?: User;
    createdAt: Date;
    updatedAt: Date;
    get isExpired(): boolean;
    get isUsable(): boolean;
    get remainingUses(): number;
}
