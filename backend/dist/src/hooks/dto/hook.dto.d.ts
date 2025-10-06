import { EventType } from '../entities/hook.entity';
export declare class CreateHookDto {
    eventType: EventType;
    data: Record<string, any>;
    stellarTransactionId?: string;
    stellarAccountId?: string;
}
export declare class StellarEventDto {
    transactionId: string;
    accountId: string;
    eventType: EventType;
    eventData: Record<string, any>;
    contractId?: string;
}
export declare class HookResponseDto {
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
