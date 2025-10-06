export declare enum EventType {
    XP_UPDATE = "xp_update",
    TOKEN_SEND = "token_send",
    TOKEN_RECEIVE = "token_receive",
    CONTRACT_CALL = "contract_call",
    ACCOUNT_CREATED = "account_created"
}
export declare class Hook {
    id: string;
    eventType: EventType;
    data: Record<string, any>;
    stellarTransactionId?: string;
    stellarAccountId?: string;
    processed: boolean;
    createdAt: Date;
    processedAt?: Date;
    errorMessage?: string;
}
