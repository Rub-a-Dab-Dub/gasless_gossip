import { HooksService } from '../services/hooks.service';
import { CreateHookDto, StellarEventDto, HookResponseDto } from '../dto/hook.dto';
import { EventType } from '../entities/hook.entity';
export declare class HooksController {
    private readonly hooksService;
    private readonly logger;
    constructor(hooksService: HooksService);
    processStellarEvent(stellarEventDto: StellarEventDto): Promise<HookResponseDto>;
    createHook(createHookDto: CreateHookDto): Promise<HookResponseDto>;
    getHookById(id: string): Promise<HookResponseDto>;
    getHooks(limit?: string, eventType?: EventType): Promise<HookResponseDto[]>;
    processUnprocessedHooks(): Promise<void>;
    getHookStats(): Promise<any>;
}
