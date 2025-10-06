import { LoggerService as NestLogger } from '@nestjs/common';
import 'winston-daily-rotate-file';
export declare class LoggerService implements NestLogger {
    private logger;
    constructor();
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    logAdminAction(action: string, adminId: string, metadata?: any): void;
}
