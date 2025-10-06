export declare class CreateGambleDto {
    gossipId: string;
    userId: string;
    amount: number;
    choice: 'truth' | 'fake';
    txId: string;
}
export declare class ResolveGambleDto {
    gambleId: string;
    outcome: 'truth' | 'fake';
}
