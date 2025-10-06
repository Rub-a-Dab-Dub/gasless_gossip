export declare class CreateTipDto {
    amount: number;
    receiverId: string;
}
export declare class TipResponseDto {
    id: string;
    amount: number;
    receiverId: string;
    senderId: string;
    txId: string;
    createdAt: Date;
    receiver?: {
        id: string;
        username: string;
    };
    sender?: {
        id: string;
        username: string;
    };
}
