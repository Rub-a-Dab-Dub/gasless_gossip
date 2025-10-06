import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
export declare class ReactionsController {
    private readonly reactionsService;
    constructor(reactionsService: ReactionsService);
    addReaction(dto: CreateReactionDto): Promise<import("./reaction.entity").Reaction>;
    getReactions(messageId: string): Promise<{
        [type: string]: number;
    }>;
}
