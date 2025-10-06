import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AutoDelete } from '../entities/auto-delete.entity';
import { Message } from '../../messages/message.entity';
import { SetAutoDeleteDto } from '../dto/set-auto-delete.dto';
import { StellarService } from '../../stellar/stellar.service';
export declare class AutoDeleteService implements OnModuleInit {
    private readonly autoDeleteRepo;
    private readonly messageRepo;
    private readonly stellarService;
    private readonly logger;
    private intervalHandle;
    constructor(autoDeleteRepo: Repository<AutoDelete>, messageRepo: Repository<Message>, stellarService: StellarService);
    onModuleInit(): void;
    setTimer(dto: SetAutoDeleteDto): Promise<AutoDelete>;
    getTimer(messageId: string): Promise<AutoDelete | null>;
    processExpired(): Promise<void>;
}
