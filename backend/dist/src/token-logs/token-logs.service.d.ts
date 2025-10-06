import { Repository } from 'typeorm';
import { TokenLog } from './token-log.entity';
import { CreateTokenLogDto } from './dto/create-token-log.dto';
import { GetTokenLogsQueryDto } from './dto/get-token-logs-query.dto';
export declare class TokenLogsService {
    private readonly tokenLogRepository;
    constructor(tokenLogRepository: Repository<TokenLog>);
    logTransaction(dto: CreateTokenLogDto): Promise<TokenLog>;
    getLogsForUser(userId: string, query?: GetTokenLogsQueryDto): Promise<{
        data: TokenLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSummaryForUser(userId: string): Promise<{
        totalSent: string;
        totalReceived: string;
    }>;
}
