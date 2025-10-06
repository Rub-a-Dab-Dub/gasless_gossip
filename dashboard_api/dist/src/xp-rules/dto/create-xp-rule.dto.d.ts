export declare class CreateXpRuleDto {
    ruleName: string;
    ruleType: string;
    description?: string;
    multiplier: number;
    baseAmount: number;
    conditions?: Record<string, any>;
    isActive?: boolean;
    priority?: number;
    scope?: string;
    abTestGroup?: string;
    startDate?: string;
    endDate?: string;
    createdBy?: string;
}
