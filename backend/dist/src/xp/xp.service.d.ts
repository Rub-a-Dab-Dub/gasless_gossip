import { Repository, DataSource } from 'typeorm';
import { Xp } from './xp.entity';
import { ProcessedEvent } from './processed-event.entity';
import { StellarAccount } from './stellar-account.entity';
export declare class XpService {
    private readonly xpRepo;
    private readonly processedRepo;
    private readonly stellarAccountRepo;
    private readonly dataSource;
    private readonly logger;
    constructor(xpRepo: Repository<Xp>, processedRepo: Repository<ProcessedEvent>, stellarAccountRepo: Repository<StellarAccount>, dataSource: DataSource);
    getXpForUser(userId: string): Promise<number>;
    addXp(userId: string, amount: number, source?: string): Promise<Xp | undefined>;
    processStellarEvent(event: {
        type: string;
        userId: string;
        data?: any;
    }): Promise<Xp | null | undefined>;
    handleEvent(event: {
        eventId: string;
        type: string;
        userId: string;
        data?: any;
    }): Promise<Xp | null>;
}
