import type { Repository } from 'typeorm';
import type { EventEmitter2 } from '@nestjs/event-emitter';
import type { Level } from '../entities/level.entity';
import type { CreateLevelDto } from '../dto/create-level.dto';
import type { LevelResponseDto } from '../dto/level-response.dto';
export declare class LevelsService {
    private readonly logger;
    private readonly levelRepository;
    private readonly eventEmitter;
    constructor(levelRepository: Repository<Level>, eventEmitter: EventEmitter2);
    createUserLevel(createLevelDto: CreateLevelDto): Promise<LevelResponseDto>;
    getUserLevel(userId: string): Promise<LevelResponseDto>;
    addXpToUser(userId: string, xpToAdd: number, source?: string): Promise<LevelResponseDto>;
    checkLevelUp(userId: string): Promise<LevelResponseDto>;
    acknowledgeLevelUp(userId: string): Promise<LevelResponseDto>;
    getLeaderboard(limit?: number): Promise<LevelResponseDto[]>;
    getUserRank(userId: string): Promise<number>;
    private mapToResponseDto;
}
