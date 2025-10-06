import type { Repository } from "typeorm";
import type { Visit } from "../entities/visit.entity";
import type { User } from "../../users/entities/user.entity";
export declare class VisitSampleDataService {
    private readonly visitRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(visitRepository: Repository<Visit>, userRepository: Repository<User>);
    generateSampleVisits(count?: number): Promise<void>;
    generateMockUsers(count?: number): Promise<void>;
    private generateRandomIP;
    private getRandomUserAgent;
    private generateRandomStellarId;
    clearSampleData(): Promise<void>;
}
