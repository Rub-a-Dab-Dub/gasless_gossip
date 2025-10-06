export declare class GossipIntent {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    status: 'pending' | 'verified' | 'debunked' | 'expired';
    metadata?: Record<string, any>;
    upvotes: number;
    downvotes: number;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
