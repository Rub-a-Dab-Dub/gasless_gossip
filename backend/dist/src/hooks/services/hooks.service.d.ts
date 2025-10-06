import { HookRepository } from '../repositories/hook.repository';
import { HooksGateway } from '../gateways/hooks.gateway';
import { EventType } from '../entities/hook.entity';
import { CreateHookDto, StellarEventDto, HookResponseDto } from '../dto/hook.dto';
import { StellarService } from './stellar.service';
export declare class HooksService {
    private readonly hookRepository;
    private readonly hooksGateway;
    private readonly stellarService;
    private readonly logger;
    constructor(hookRepository: HookRepository, hooksGateway: HooksGateway, stellarService: StellarService);
    createHook(createHookDto: CreateHookDto): Promise<HookResponseDto>;
    processStellarEvent(stellarEventDto: StellarEventDto): Promise<HookResponseDto>;
    getHookById(id: string): Promise<HookResponseDto>;
    getRecentHooks(limit?: number): Promise<HookResponseDto[]>;
    getHooksByEventType(eventType: EventType, limit?: number): Promise<HookResponseDto[]>;
    processUnprocessedHooks(): Promise<void>;
    private processHookAsync;
    private processXpUpdate;
    private processTokenSend;
    private processTokenReceive;
    private processContractCall;
    private processAccountCreated;
    private mapToResponseDto;
    getHookStats(): Promise<any>;
}
