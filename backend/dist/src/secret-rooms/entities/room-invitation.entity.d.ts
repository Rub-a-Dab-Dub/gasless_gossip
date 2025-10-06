export declare class RoomInvitation {
    id: string;
    roomId: string;
    invitedBy: string;
    invitedUserId?: string;
    invitedEmail?: string;
    invitationCode: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'revoked';
    message?: string;
    role?: string;
    expiresInDays: number;
    expiresAt?: Date;
    acceptedAt?: Date;
    declinedAt?: Date;
    metadata?: {
        source?: string;
        campaign?: string;
        referrer?: string;
    };
    createdAt: Date;
}
