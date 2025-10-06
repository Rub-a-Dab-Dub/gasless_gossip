export declare class GossipUpdate {
    id: string;
    intentId: string;
    userId: string;
    type: 'new_intent' | 'status_change' | 'vote' | 'comment' | 'verification';
    content?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
