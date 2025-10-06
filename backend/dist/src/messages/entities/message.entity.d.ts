export declare class Message {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    messageType: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
