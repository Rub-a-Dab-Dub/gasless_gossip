import { User } from '../../users/entities/user.entity';
export declare enum ActionType {
    MESSAGE = "message",
    REACTION = "reaction",
    GIFT = "gift",
    TOKEN_SEND = "token_send",
    SECRET_SHARE = "secret_share",
    MANUAL_AWARD = "manual_award",
    ADJUSTMENT = "adjustment"
}
export declare enum TransactionStatus {
    ACTIVE = "active",
    VOIDED = "voided"
}
export declare class XPTransaction {
    id: string;
    userId: string;
    user: User;
    actionType: ActionType;
    amount: number;
    multiplier: number;
    finalAmount: number;
    status: TransactionStatus;
    reason: string;
    transactionId: string;
    adjustedBy: string;
    voidedBy: string;
    voidReason: string;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, any>;
}
