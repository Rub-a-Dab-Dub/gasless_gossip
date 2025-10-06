export declare class CreateGossipIntentDto {
    roomId: string;
    content: string;
    metadata?: Record<string, any>;
    expiresInMinutes?: number;
}
export declare class UpdateGossipIntentDto {
    intentId: string;
    status: 'pending' | 'verified' | 'debunked' | 'expired';
    reason?: string;
}
export declare class VoteGossipDto {
    intentId: string;
    action: 'upvote' | 'downvote' | 'remove';
}
export declare class CommentGossipDto {
    intentId: string;
    content: string;
}
export declare class GossipIntentDto {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    status: string;
    metadata?: Record<string, any>;
    upvotes: number;
    downvotes: number;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GossipUpdateDto {
    id: string;
    intentId: string;
    userId: string;
    type: string;
    content?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare class GossipBroadcastDto {
    type: 'new_intent' | 'status_change' | 'vote' | 'comment' | 'verification';
    intent: GossipIntentDto;
    update?: GossipUpdateDto;
    timestamp: string;
    roomId: string;
}
