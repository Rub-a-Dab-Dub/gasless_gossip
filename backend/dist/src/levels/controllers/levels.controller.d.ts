import type { LevelsService } from '../services/levels.service';
import type { CreateLevelDto } from '../dto/create-level.dto';
import type { UpdateLevelDto } from '../dto/update-level.dto';
import { LevelResponseDto } from '../dto/level-response.dto';
export declare class LevelsController {
    private readonly levelsService;
    constructor(levelsService: LevelsService);
    createLevel(createLevelDto: CreateLevelDto): Promise<LevelResponseDto>;
    getUserLevel(userId: string): Promise<LevelResponseDto>;
    addXp(userId: string, updateLevelDto: UpdateLevelDto): Promise<LevelResponseDto>;
    checkLevel(userId: string): Promise<LevelResponseDto>;
    acknowledgeLevelUp(userId: string): Promise<LevelResponseDto>;
    getUserRank(userId: string): Promise<{
        userId: string;
        rank: number;
    }>;
    getLeaderboard(limit?: number): Promise<LevelResponseDto[]>;
}
