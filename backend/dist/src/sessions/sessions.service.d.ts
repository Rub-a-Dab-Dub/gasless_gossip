import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionDto } from './dto/session.dto';
export declare class SessionsService {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<Session>);
    create(createSessionDto: CreateSessionDto): Promise<Session>;
    findByUserId(userId: string): Promise<SessionDto[]>;
    findById(id: string): Promise<Session>;
    findByToken(token: string): Promise<Session | null>;
    revoke(id: string): Promise<void>;
    cleanExpired(): Promise<void>;
}
