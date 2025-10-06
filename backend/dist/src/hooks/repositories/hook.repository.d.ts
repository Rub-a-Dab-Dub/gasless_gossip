import { Repository } from 'typeorm';
import { Hook, EventType } from '../entities/hook.entity';
export declare class HookRepository {
    private readonly hookRepository;
    constructor(hookRepository: Repository<Hook>);
    create(hookData: Partial<Hook>): Promise<Hook>;
    findById(id: string): Promise<Hook | null>;
    findByTransactionId(transactionId: string): Promise<Hook | null>;
    findUnprocessed(): Promise<Hook[]>;
    findByEventType(eventType: EventType, limit?: number): Promise<Hook[]>;
    markAsProcessed(id: string, errorMessage?: string): Promise<void>;
    findRecent(limit?: number): Promise<Hook[]>;
}
