export declare enum TransactionType {
    MINT = "mint",
    BURN = "burn",
    GIFT = "gift",
    TRADE = "trade",
    BATTLE_REWARD = "battle_reward",
    ADMIN_ASSIGN = "admin_assign",
    ADMIN_REVOKE = "admin_revoke"
}
export declare class GiftTransaction {
    id: string;
    giftId: string;
    type: TransactionType;
    fromUserId: string;
    toUserId: string;
    quantity: number;
    metadata: {
        battleId?: string;
        roomId?: string;
        reason?: string;
        adminId?: string;
    };
    createdAt: Date;
}
