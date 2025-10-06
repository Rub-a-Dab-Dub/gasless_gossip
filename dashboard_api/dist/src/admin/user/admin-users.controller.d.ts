import { AdminUsersService, BulkCreateError } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BulkCreateUsersDto } from './dto/bulk-create-users.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AdminUsersController {
    private readonly usersService;
    constructor(usersService: AdminUsersService);
    create(createUserDto: CreateUserDto, req: {
        user: {
            id: string;
        };
    }): Promise<{
        data: import("../../user/entities/user.entity").User;
    }>;
    bulkCreate(bulkDto: BulkCreateUsersDto, req: {
        user: {
            id: string;
        };
    }): Promise<{
        data: {
            success: boolean;
            errors?: BulkCreateError[];
        };
    }>;
    findAll(query: QueryUsersDto): Promise<{}>;
    findOne(id: string): Promise<{
        data: import("../../user/entities/user.entity").User;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: {
        user: {
            id: string;
        };
    }): Promise<{
        data: import("../../user/entities/user.entity").User;
    }>;
    softDelete(id: string, req: {
        user: {
            id: string;
        };
    }): Promise<void>;
    hardDelete(id: string, req: {
        user: {
            id: string;
        };
    }): Promise<void>;
    getAuditLogs(id: string, page?: number, limit?: number): Promise<{
        data: import("../../audit-log/entities/audit-log.entity").AuditLog[];
        meta: {
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
}
