export declare class DauAlert {
    id: string;
    alertDate: Date;
    featureName: string;
    alertType: "drop" | "spike" | "threshold";
    severity: "low" | "medium" | "high" | "critical";
    currentValue: number;
    expectedValue: number;
    dropPercentage: number;
    message: string;
    isResolved: boolean;
    resolvedAt: Date;
    createdAt: Date;
}
