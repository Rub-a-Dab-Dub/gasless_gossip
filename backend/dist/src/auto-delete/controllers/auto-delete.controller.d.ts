import { AutoDeleteService } from '../services/auto-delete.service';
import { SetAutoDeleteDto } from '../dto/set-auto-delete.dto';
export declare class AutoDeleteController {
    private readonly service;
    constructor(service: AutoDeleteService);
    setTimer(dto: SetAutoDeleteDto): Promise<{
        messageId: string;
        expiry: Date;
    }>;
    getTimer(messageId: string): Promise<{
        messageId: string;
        expiry: Date;
    } | {
        messageId: string;
        expiry: null;
    }>;
}
