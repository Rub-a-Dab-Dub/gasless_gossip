import { TokenLogsService } from './token-logs.service';
import { GetTokenLogsQueryDto } from './dto/get-token-logs-query.dto';
export declare class TokenLogsController {
    private readonly tokenLogsService;
    constructor(tokenLogsService: TokenLogsService);
    getLogs(userId: string, query: GetTokenLogsQueryDto): Promise<{
        data: import("./token-log.entity").TokenLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    getSummary(userId: string): Promise<{
        totalSent: string;
        totalReceived: string;
    }>;
}
