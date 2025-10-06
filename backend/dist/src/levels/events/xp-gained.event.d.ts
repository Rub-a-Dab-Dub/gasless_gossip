export declare class XpGainedEvent {
    readonly userId: string;
    readonly xpAmount: number;
    readonly source: string;
    readonly metadata?: Record<string, any> | undefined;
    constructor(userId: string, xpAmount: number, source: string, metadata?: Record<string, any> | undefined);
}
