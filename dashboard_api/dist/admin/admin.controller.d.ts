import { LoggerService } from '../logger/logger.service';
export declare class AdminController {
    private readonly logger;
    constructor(logger: LoggerService);
    performAction(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
