import { ModerationService } from './moderation.service';
import { CreateModerationActionDto, ReverseModerationActionDto } from './dto/moderation-action.dto';
export declare class ModerationController {
    private readonly moderationService;
    constructor(moderationService: ModerationService);
    banUser(req: any, createDto: CreateModerationActionDto): Promise<any>;
    kickUser(req: any, createDto: CreateModerationActionDto): Promise<any>;
    muteUser(req: any, createDto: CreateModerationActionDto): Promise<any>;
    unbanUser(req: any, reverseDto: ReverseModerationActionDto): Promise<any>;
    unmuteUser(req: any, reverseDto: ReverseModerationActionDto): Promise<any>;
    warnUser(req: any, createDto: CreateModerationActionDto): Promise<any>;
    getModerationHistory(roomId: string, targetId?: string): Promise<any>;
    getActiveModerations(roomId: string): Promise<any>;
    checkBanStatus(roomId: string, userId: string): Promise<{
        isBanned: any;
    }>;
    checkMuteStatus(roomId: string, userId: string): Promise<{
        isMuted: any;
    }>;
}
