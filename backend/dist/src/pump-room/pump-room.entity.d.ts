export declare class PumpRoom {
    id: string;
    roomId: string;
    predictions: Record<string, any>[];
    votes: Record<string, any>;
    totalVotes: number;
    isActive: boolean;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
