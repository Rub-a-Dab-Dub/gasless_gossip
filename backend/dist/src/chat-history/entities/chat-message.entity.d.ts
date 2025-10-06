export declare class ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    messageType?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
