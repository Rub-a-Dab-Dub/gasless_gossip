import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { XpService } from './xp.service';
export declare class StellarListenerService implements OnModuleInit {
    private readonly config;
    private readonly xpService;
    private readonly logger;
    constructor(config: ConfigService, xpService: XpService);
    onModuleInit(): void;
    start(): void;
}
