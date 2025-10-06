import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { AuditLog } from 'src/audit-log/entities/audit-log.entity';
import { Pseudonym } from 'src/pseudonym/entities/pseudonym.entity';
import { User } from 'src/user/entities/user.entity';
import { BulkCreateUsersDto } from './dto/bulk-create-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wallet } from 'src/wallet/entities/wallet.entity';
export interface BulkCreateError {
    user: string;
    error: string;
}
export declare class AdminUsersService {
    private userRepo;
    private pseudonymRepo;
    private walletRepo;
    private auditLogRepo;
    private cacheManager;
    private provider;
    constructor(userRepo: Repository<User>, pseudonymRepo: Repository<Pseudonym>, walletRepo: Repository<Wallet>, auditLogRepo: Repository<AuditLog>, cacheManager: Cache);
    create(createUserDto: CreateUserDto, adminId: string): Promise<User>;
    bulkCreate(bulkDto: BulkCreateUsersDto, adminId: string): Promise<{
        success: number;
        failed: number;
        errors: BulkCreateError[];
    }>;
    findAll(query: QueryUsersDto): Promise<{}>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, adminId: string): Promise<User>;
    softDelete(id: string, adminId: string): Promise<void>;
    hardDelete(id: string, adminId: string): Promise<void>;
    getAuditLogs(userId: string, page?: number, limit?: number): Promise<{
        data: AuditLog[];
        meta: {
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    private getWalletBalance;
    private createAuditLog;
}
