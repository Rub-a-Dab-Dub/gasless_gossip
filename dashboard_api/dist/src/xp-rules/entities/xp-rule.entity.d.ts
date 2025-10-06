export declare class XpRule {
    id: string;
    ruleName: string;
    ruleType: string;
    description: string;
    multiplier: number;
    baseAmount: number;
    conditions: {
        minLevel?: number;
        maxLevel?: number;
        questType?: string;
        timeWindow?: string;
        userSegment?: string;
    };
    isActive: boolean;
    priority: number;
    scope: string;
    abTestGroup: string;
    startDate: Date;
    endDate: Date;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
