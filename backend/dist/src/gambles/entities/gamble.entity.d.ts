export declare class Gamble {
    id: string;
    gossipId: string;
    bets: {
        userId: string;
        amount: number;
        choice: 'truth' | 'fake';
        txId: string;
    }[];
    resolvedChoice: 'truth' | 'fake';
    createdAt: Date;
}
