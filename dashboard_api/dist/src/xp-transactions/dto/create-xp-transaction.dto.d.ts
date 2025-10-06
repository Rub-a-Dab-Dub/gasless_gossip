import { ActionType } from '../entities/xp-transaction.entity';
export declare class CreateXPTransactionDto {
    userId: string;
    actionType: ActionType;
    amount: number;
    multiplier?: number;
    reason?: string;
    transactionId?: string;
    metadata?: Record<string, any>;
}
