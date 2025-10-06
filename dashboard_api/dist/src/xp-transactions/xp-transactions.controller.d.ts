import { Response } from 'express';
import { XPTransactionService } from './xp-transaction.service';
import { CreateXPTransactionDto } from './dto/create-xp-transaction.dto';
import { UpdateXPTransactionDto } from './dto/update-xp-transaction.dto';
import { VoidXPTransactionDto } from './dto/void-xp-transaction.dto';
import { QueryXPTransactionDto } from './dto/query-xp-transaction.dto';
export declare class XPTransactionController {
    private readonly xpService;
    constructor(xpService: XPTransactionService);
    create(dto: CreateXPTransactionDto): Promise<any>;
    findAll(query: QueryXPTransactionDto): Promise<any>;
    getAggregates(startDate?: string, endDate?: string): Promise<any>;
    getUserTotal(userId: string): Promise<{
        userId: string;
        totalXP: any;
    }>;
    exportCSV(query: QueryXPTransactionDto, anonymize: string, res: Response): Promise<void>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateXPTransactionDto): Promise<any>;
    void(id: string, dto: VoidXPTransactionDto): Promise<any>;
}
