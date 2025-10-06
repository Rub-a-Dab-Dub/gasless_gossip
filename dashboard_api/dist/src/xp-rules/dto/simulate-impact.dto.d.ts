export declare class SimulateImpactDto {
    simulationName: string;
    ruleChanges: Array<{
        ruleId: string;
        newMultiplier?: number;
        newBaseAmount?: number;
    }>;
    createdBy?: string;
}
