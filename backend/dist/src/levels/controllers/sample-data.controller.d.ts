import type { SampleDataService } from '../test/sample-data.service';
export declare class SampleDataController {
    private readonly sampleDataService;
    constructor(sampleDataService: SampleDataService);
    generateSampleData(): Promise<{
        message: string;
        timestamp: string;
    }>;
    resetSampleData(): Promise<{
        message: string;
        timestamp: string;
    }>;
}
