import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionCountDto } from './dto/reaction-response.dto';
export declare class ReactionsService {
    private readonly reactionRepository;
    constructor(reactionRepository: Repository<Reaction>);
    createReaction(createReactionDto: CreateReactionDto, userId: string): Promise<Reaction>;
    removeReaction(messageId: string, userId: string): Promise<void>;
    getReactionsByMessage(messageId: string, userId: string): Promise<ReactionCountDto>;
    getUserReactionForMessage(messageId: string, userId: string): Promise<Reaction | null>;
    private validateMessageAccess;
    private triggerXpUpdate;
    private getXpAmountForAction;
    getReactionStats(): Promise<any>;
}
