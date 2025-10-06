export declare class XpRuleVersion {
    id: string;
    ruleId: string;
    version: number;
    ruleData: {
        ruleName: string;
        ruleType: string;
        multiplier: number;
        baseAmount: number;
        conditions: any;
        isActive: boolean;
        priority: number;
        scope: string;
    };
    changeDescription: string;
    changedBy: string;
    createdAt: Date;
}
