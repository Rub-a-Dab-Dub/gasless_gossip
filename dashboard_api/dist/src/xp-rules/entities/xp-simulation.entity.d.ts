export declare class XpSimulation {
    id: string;
    simulationId: string;
    simulationName: string;
    ruleChanges: Array<{
        ruleId: string;
        ruleName: string;
        oldMultiplier: number;
        newMultiplier: number;
        oldBaseAmount: number;
        newBaseAmount: number;
    }>;
    impactAnalysis: {
        affectedUsers: number;
        avgXpChange: number;
        minXpChange: number;
        maxXpChange: number;
        totalXpImpact: number;
        levelDistributionChange: Record<string, number>;
    };
    status: string;
    createdBy: string;
    appliedAt: Date;
    createdAt: Date;
}
