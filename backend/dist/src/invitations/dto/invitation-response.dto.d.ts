import { InvitationStatus } from "../entities/invitation.entity";
export declare class UserSummaryDto {
    id: string;
    username: string;
    avatar?: string;
}
export declare class InvitationResponseDto {
    id: string;
    roomId: string;
    code: string;
    message?: string;
    status: InvitationStatus;
    expiresAt: Date;
    acceptedAt?: Date;
    usageCount: number;
    maxUsage: number;
    remainingUses: number;
    isExpired: boolean;
    isUsable: boolean;
    inviter: UserSummaryDto;
    invitee?: UserSummaryDto;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
    get shareableLink(): string;
    stellarTxId?: string;
}
