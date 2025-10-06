export declare class AddXpDto {
    userId: string;
    amount: number;
    source?: string;
}
export declare class StellarEventDto {
    eventId: string;
    type: string;
    userId: string;
    data?: any;
}
export declare class MapStellarAccountDto {
    stellarAccount: string;
    userId?: string;
}
