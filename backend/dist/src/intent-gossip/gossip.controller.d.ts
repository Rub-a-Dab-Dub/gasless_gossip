import { IntentGossipService } from './intent-gossip.service';
import { BroadcastIntentDto } from './dto/broadcast-intent.dto';
export declare class GossipController {
    private readonly intentGossipService;
    private readonly logger;
    constructor(intentGossipService: IntentGossipService);
    broadcastIntent(req: any, broadcastIntentDto: BroadcastIntentDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
