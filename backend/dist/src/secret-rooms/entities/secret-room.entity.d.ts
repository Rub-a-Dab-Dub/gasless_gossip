export declare class SecretRoom {
    id: string;
    creatorId: string;
    name: string;
    description?: string;
    roomCode: string;
    isPrivate: boolean;
    isActive: boolean;
    status: 'active' | 'inactive' | 'archived' | 'deleted';
    maxUsers: number;
    currentUsers: number;
    category?: string;
    theme?: string;
    settings?: {
        allowAnonymous?: boolean;
        requireApproval?: boolean;
        autoDelete?: boolean;
        deleteAfterHours?: number;
        allowFileSharing?: boolean;
        maxFileSize?: number;
        moderationLevel?: 'low' | 'medium' | 'high';
    };
    metadata?: {
        tags?: string[];
        location?: string;
        timezone?: string;
        language?: string;
        ageRestriction?: number;
    };
    lastActivityAt?: Date;
    expiresAt?: Date;
    archivedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
