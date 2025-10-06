import type { LevelsService } from '../services/levels.service';
export interface SampleUser {
    id: string;
    username: string;
    email: string;
    stellarAccountId: string;
}
export interface XpActivity {
    userId: string;
    xpAmount: number;
    source: string;
    description: string;
}
export declare class SampleDataService {
    private readonly levelsService;
    private readonly logger;
    constructor(levelsService: LevelsService);
    createSampleUsers(): Promise<SampleUser[]>;
    initializeSampleLevels(users: SampleUser[]): Promise<void>;
    generateSampleXpActivities(): Promise<XpActivity[]>;
    applySampleXpActivities(activities: XpActivity[]): Promise<void>;
    runFullSampleDataGeneration(): Promise<void>;
    private displaySampleResults;
    resetSampleData(): Promise<void>;
}
