export declare class LevelUpEvent {
    readonly userId: string;
    readonly previousLevel: number;
    readonly newLevel: number;
    readonly totalXp: number;
    readonly badgesUnlocked: string[];
    constructor(userId: string, previousLevel: number, newLevel: number, totalXp: number, badgesUnlocked?: string[]);
}
