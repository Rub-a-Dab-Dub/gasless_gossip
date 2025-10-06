export declare class EventBoostService {
    private isActive;
    private globalFlag;
    private impactData;
    handleCron(): void;
    activateBoost(): void;
    deactivateBoost(): void;
    updateImpact(): void;
    deleteEvent(): void;
    getReport(): string;
    setGlobalFlag(flag: boolean): void;
}
