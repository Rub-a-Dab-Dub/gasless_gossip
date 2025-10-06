import { DataSource, Repository } from 'typeorm';
import { XPTransaction, ActionType } from '../entities/xp-transaction.entity';
import { QueryXPTransactionDto } from '../dto/query-xp-transaction.dto';
export declare class XPTransactionRepository extends Repository<XPTransaction> {
    private dataSource;
    constructor(dataSource: DataSource);
    findPaginated(query: QueryXPTransactionDto): Promise<{
        items: XPTransaction[];
        meta: {
            total: number;
            page: number | undefined;
            limit: number | undefined;
            totalPages: number;
        };
    }>;
    getUserTotalXP(userId: string): Promise<number>;
    getGlobalAggregates(startDate?: Date, endDate?: Date): Promise<{
        totalXP: number;
        transactionCount: number;
        averageXP: number;
    }>;
    getTopUsers(limit?: number): Promise<{
        userId: any;
        username: any;
        totalXP: number;
    }[]>;
    getDistributionByType(): Promise<Record<ActionType, number>>;
    getXPTimeline(days?: number): Promise<{
        date: any;
        totalXP: number;
    }[]>;
    detectSuspiciousActivity(userId: string, hours?: number): Promise<number>;
}
