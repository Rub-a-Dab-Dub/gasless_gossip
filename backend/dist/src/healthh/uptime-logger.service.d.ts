import { Repository } from 'typeorm';
import { UptimeLog } from '../entities/uptime-log.entity';
export declare class UptimeLoggerService {
    private uptimeRepo;
    constructor(uptimeRepo: Repository<UptimeLog>);
    logUptime(): Promise<void>;
}
