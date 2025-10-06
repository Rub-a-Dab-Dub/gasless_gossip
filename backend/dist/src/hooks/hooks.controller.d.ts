import type { Request } from 'express';
import { HooksService } from './hooks.service';
export declare class HooksController {
    private readonly hooksService;
    private readonly logger;
    constructor(hooksService: HooksService);
    handleStellarEvent(body: {
        eventType: string;
        data: unknown;
    }, request: Request): Promise<{
        status: string;
        hook: import("./hook.entity").Hook;
    }>;
}
