import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionResponseDto, ReactionCountDto } from './dto/reaction-response.dto';
export declare class ReactionsController {
    private readonly reactionsService;
    constructor(reactionsService: ReactionsService);
    createReaction(createReactionDto: CreateReactionDto, req: any): Promise<ReactionResponseDto>;
    getReactionsByMessage(messageId: string, req: any): Promise<ReactionCountDto>;
    getUserReaction(messageId: string, req: any): Promise<ReactionResponseDto | null>;
    removeReaction(messageId: string, req: any): Promise<void>;
    getReactionStats(): Promise<any>;
}
