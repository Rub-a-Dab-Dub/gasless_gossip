export declare class XpChangeNotification {
    id: string;
    userId: string;
    notificationType: string;
    title: string;
    message: string;
    changes: {
        ruleId?: string;
        ruleName?: string;
        oldValue?: number;
        newValue?: number;
        impact?: string;
    };
    isRead: boolean;
    readAt: Date;
    createdAt: Date;
}
