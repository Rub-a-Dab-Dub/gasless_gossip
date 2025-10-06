import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';
export declare class ReactionsService {
    private readonly reactionRepository;
    constructor(reactionRepository: Repository<Reaction>);
    addReaction(dto: CreateReactionDto): Promise<Reaction>;
    getReactionsForMessage(messageId: string): Promise<Reaction[]>;
    countReactions(messageId: string): Promise<{
        [type: string]: number;
    }>;
}
