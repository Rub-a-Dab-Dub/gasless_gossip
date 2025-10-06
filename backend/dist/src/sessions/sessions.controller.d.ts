import { SessionsService } from './sessions.service';
import { SessionDto } from './dto/session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    findByUserId(userId: string, req: any): Promise<SessionDto[]>;
    revoke(id: string, req: any): Promise<void>;
}
