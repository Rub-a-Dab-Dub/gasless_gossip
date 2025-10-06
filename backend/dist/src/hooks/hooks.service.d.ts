import { Repository } from 'typeorm';
import { Hook } from './hook.entity';
import { WebSocketsGateway } from '../websockets/websockets.gateway';
export declare class HooksService {
    private readonly hookRepository;
    private readonly webSocketsGateway;
    private readonly logger;
    constructor(hookRepository: Repository<Hook>, webSocketsGateway: WebSocketsGateway);
    processStellarEvent(eventType: string, data: unknown): Promise<Hook>;
}
