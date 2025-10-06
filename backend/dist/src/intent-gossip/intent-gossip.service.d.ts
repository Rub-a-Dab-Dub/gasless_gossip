import { Repository } from 'typeorm';
import { BroadcastIntentDto } from './dto/broadcast-intent.dto';
import { IntentLog } from './entities/intent-log.entity';
export declare class IntentGossipService {
    private readonly intentLogRepository;
    private readonly logger;
    constructor(intentLogRepository: Repository<IntentLog>);
    broadcastIntent(userId: string, broadcastIntentDto: BroadcastIntentDto): Promise<void>;
    getIntentLogsByUser(userId: string): Promise<IntentLog[]>;
}
